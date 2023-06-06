'use strict'

// import { closeModal, getChildNodes, openModal } from './core.js'

var currentformid = "";
var cookieAttribute='';
var hrefPath = "";
var submitStatus=false
var current_page=window.location.href;
var current_page_split = current_page.split(".html");
var token = "";
const updateModalBackdrop = (modal) => {	
    const backdrop = modal.querySelector('.modal-backdrop')	
    if (backdrop) {	
        const container = modal.querySelector('.modal-container')	
        const height = window.innerHeight > outerHeight(container) ? window.innerHeight : outerHeight(container)	
        backdrop.style.setProperty('height', `${height}px`)	
    }	
}
const fixRecaptchaPosition = () => {	
    const gcChal = document.querySelectorAll('iframe[title="recaptcha challenge expires in two minutes"]')
    _.forEach(gcChal, (item) => {	
        if (item?.parentNode) {	
            item.parentNode.parentNode.style.position = 'fixed'	
            item.parentNode.parentNode.style.zIndex = 30	
        }	
    })	
}
const watchModal = ({ modalId = null, callbackOnOpen = () => {}, callbackOnClose = () => {} }) => {
    if (!modalId) return
    const config = { characterData: false, attributes: true, childList: false, subtree: false }
    const modalObserver = new MutationObserver((mutations) => {
        const modal = document.querySelector(`[data-modal-id=${modalId}]`)
        const isOpenAction = modal?.parentNode.classList.contains('active')
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
                if (isOpenAction) {
                    fixRecaptchaPosition()
                    return callbackOnOpen()
                }
                return callbackOnClose()
            }
        })
    })

    const resizeObserver = new ResizeObserver((entries) => {
        callbackOnOpen()
    })

    const modal = document.querySelector(`[data-modal-id=${modalId}]`)
    if (modal) {	
        resizeObserver.observe(modal)	
        if (modal?.parentNode) {	
            modalObserver.observe(modal?.parentNode, config)	
        }	
    }
}
const outerHeight = (element) => {
    const height = element.offsetHeight,
        style = window.getComputedStyle(element)
    return ['top', 'bottom'].map((side) => parseInt(style[`margin-${side}`])).reduce((total, side) => total + side, height)	
    }
const openModal = (modalId, receivedValues = null) => {
    const modal = document.querySelector(`[data-modal-id=${modalId}]`)
    if (modal) {
        const wrapper = modal.parentNode

        if (receivedValues) {
            _.map(receivedValues, (item) => {
                const input = wrapper.querySelector(`input[name="${item.name}"]`)	
                input.value = item.value
            })
        }

        wrapper.classList.add('active')
        disableScroll()
    } else {
        console.log('modal not found')
    }
}
var verifyCallback = function(response) {
    token = response;
    if(token!=""){
        $('#captcha-error-container').css('display','none');
    }
};
const __initModal = () => {
    const openModalBtns = document.querySelectorAll('[data-open-modal-btn]')
    var siteKey = $('#siteKey').val();
                grecaptcha.render('captcha-container', {
                    'sitekey' : siteKey,
                    'callback' : verifyCallback,
                    'theme' : 'light'
                  });
    _.forEach(openModalBtns, (btn) => {
        
        btn.addEventListener('click', (e) => {
                e.preventDefault();
                cookieStatus=false;
                var cookies = document.cookie.split(';');
                cookies.forEach((cookie)=>{
                    if(cookie.split('=')[0].trim()=='onebkkdownload' &&  cookie.split('=')[1].trim()=='true' ){
                        cookieStatus = true;
                    }
                })
                
                cookieAttribute = btn.getAttribute('id')
                if( cookieStatus && cookieAttribute=='download-Cookie'){
                    downloadAsset(btn.href);
                }
                else{
                    hrefPath = btn.href;
                    currentformid = btn.dataset.openModalBtn;
                    __initEnquireFormSubmitBtn()
                    
                    onChangeResetValidate()
                    watchModal({
                        modalId: currentformid,
                        callbackOnClose: () => {
                            resetFormEnquireForm()
                            resetFormEnquireFormValidation()
                        },
                    })
                    e.preventDefault()
                    const autoFillFormValues = btn.dataset.openModalAutoFill
                    const autoFillForm = _.compact(_.split(autoFillFormValues, ' '))
        
                    if (autoFillForm) {
                        const receivedValues = _.map(autoFillForm, (item) => {
                            const input = btn.parentNode.querySelector(`input[name="${item}"]`)
                            let value	
                            value = input.value	
                            input.value = ''
                            return {
                                name: item,
                                value:value,
                            }
                        })
        
                        openModal(btn.dataset.openModalBtn, receivedValues)
                    } else {
                        openModal(btn.dataset.openModalBtn)
                    }
                }
        })
    })

    const openCarouselModalBtns = document.querySelectorAll('[data-open-modal-carousel-btn]')
    _.forEach(openCarouselModalBtns, (btn) => {
        btn.addEventListener('click', () => {
            openModalCarousel(btn.dataset.openModalCarouselBtn)
        })
    })

    const closeModalBtns = document.querySelectorAll('.modal__close-btn')
    _.forEach(closeModalBtns, (btn) => {
        if (btn.dataset.modalId && btn.dataset.modalId.trim()!='special-message') {
            btn.addEventListener('click', () => {
                closeModal(btn.dataset.modalId)
            })
        }
    })

    const modalBackdrop = document.querySelectorAll('.modal-backdrop')
    _.forEach(modalBackdrop, (backdrop) => {
        backdrop.addEventListener('click', () => {
            closeModal()
        })
    })

    const modals = document.querySelectorAll('[data-modal-id]')
    _.forEach(modals, (modal) => {
        modal?.parentNode && updateModalBackdrop(modal?.parentNode)
        window.addEventListener('resize', (e) => {
            modal?.parentNode && updateModalBackdrop(modal?.parentNode)
        })
        watchModal({
            modalId: modal.dataset.modalId,
            callbackOnOpen: () => {
                modal?.parentNode && updateModalBackdrop(modal?.parentNode)
            },
            callbackOnClose: () => {
                modal?.parentNode && updateModalBackdrop(modal?.parentNode)
            },
        })
    })
}

const resetFormEnquireForm = () => {
        if (!document.forms[currentformid] || !document.forms[currentformid]['firstName']) {

        return
        
        }
        grecaptcha.reset();
        token = "";
         $('#captcha-error-container').css('display','none');
    const formValues = {
       
        firstName: document.forms[currentformid]['firstName']?.value,
        lastName: document.forms[currentformid]['lastName']?.value,
        email: document.forms[currentformid]['email']?.value,
        mobile: document.forms[currentformid]['mobile']?.value,
        companyName: document.forms[currentformid]['companyName']?.value,
        message: document.forms[currentformid]['message']?.value,
    }

    for (let key in formValues) {
        if (document.forms[currentformid][key]) {
            document.forms[currentformid][key].value = ''
        }
    }

    const formSelect = {
        department:
        _.find(getChildNodes(document.forms[currentformid]?.querySelector('[data-select-name="department"]')), (item) =>
                item.classList.contains('active')
            )?.dataset?.optionValue || '',
    }

    for (let key in formSelect) {
        const input = document.forms[currentformid]?.querySelector(`[data-select-name="${key}"]`)?.parentNode
        const placeholder = input?.querySelector('.custom-dropdown__placeholder')
        if (placeholder) placeholder.style.display = 'block'

        const activePlaceholder = input?.querySelector('.custom-dropdown__active-option-value')
        if (activePlaceholder) activePlaceholder.style.display = 'none'

        const activeOption = input?.querySelector('.custom-dropdown__item.active')
        activeOption && activeOption?.classList.remove('active')
    }

    const formCheckbox = {
        acceptAgreement: document.forms[currentformid]['acceptAgreement']?.checked,
        acceptMarketing: document.forms[currentformid]['acceptMarketing']?.checked,
    }

    for (let key in formCheckbox) {
        const event = new Event('change')
        const input = document.forms[currentformid][key]
        if (input) {
            input.checked = false
            input.dispatchEvent(event)
        }
    }
}

const resetFormEnquireFormValidation = () => {
    if (!document.forms[currentformid] || !document.forms[currentformid]['firstName']) {

        return
        
        }
    _.forEach(document.forms[currentformid].querySelectorAll('.input--error'), (item) => item.classList.remove('input--error'))

    _.forEach(document.forms[currentformid].querySelectorAll('.input-error-msg'), (item) => item.classList.add('hidden'))
}

const resetFormEnquireFormValidationInput = (key) => {
    const input = document.forms[currentformid][key]
    const parentInput = input?.parentNode
    if (parentInput) {  
        const errorMessageJsInjection = parentInput.querySelector('[data-error-type="jsInjection"]')
        const errorMessageEmpty = parentInput.querySelector('[data-error-type="empty"]')
        const errorMessageInvalid = parentInput.querySelector('[data-error-type="invalid"]')
        if (input) {
            if (key === 'acceptAgreement') {
                parentInput.classList.remove('input--error')
            } else {
                input.classList.remove('input--error')
            }
            if (errorMessageJsInjection) {
                errorMessageJsInjection.classList.add('hidden')
            }
            if (errorMessageEmpty) {
                errorMessageEmpty.classList.add('hidden')
            }
            if (errorMessageInvalid) {
                errorMessageInvalid.classList.add('hidden')
            }
        }
    }
}
const validateEnquireForm = (callback = () => {}, fieldName = null, injectionOnly = false) => {
    let mandatoryCheckPassed = true
    let formatCheckPassed = true

    if (!fieldName) {
        resetFormEnquireFormValidation()
    }

    const formValues = {
        firstName: document.forms[currentformid]['firstName'].value,
        lastName: document.forms[currentformid]['lastName'].value,
        email: document.forms[currentformid]['email'].value,
        mobile: document.forms[currentformid]['mobile'].value,
        //companyName: document.forms[currentformid]['companyName'].value,
        message: document.forms[currentformid]['message'].value,
    }
    const optionalFormValues = {
        companyName: document.forms[currentformid]['companyName'].value,
    }

    const formSelect = {
        department:
            _.find(getChildNodes(document.forms[currentformid].querySelector('[data-select-name="department"]')), (item) =>
                item.classList.contains('active')
            )?.dataset?.optionValue || '',
    }

    const formCheckbox = {
        acceptAgreement: document.forms[currentformid]['acceptAgreement'].checked,
        acceptMarketing: document.forms[currentformid]['acceptMarketing'].checked,
    }
    const validateScriptInjection = (value) => {
        return (
            String(value)
                .toLowerCase()
                .match(/<script\b[^>]*>([\s\S]*?)<\/script>/gm) ||
            String(value)
                .toLowerCase()
                .match(/<script\b[^>]*>/gm)
        )
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }
    const validateMobile = (mobile) => {
        return (
            String(mobile)
                .toLowerCase()
                // .match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
                .match(/^[\+]?[(]?[0-9]{0,3}[)]?[-\s\.]?[0-9]{0,3}[-\s\.]?[0-9]{4,6}$/im)
        )
    }
    const handleValidateScriptInjection = (specificField = null) => {
        const allFormValues = { ...optionalFormValues, ...formValues }
        if (specificField) {
            if (validateScriptInjection(allFormValues[specificField])) {
                mandatoryCheckPassed = false
                const input = document.forms[currentformid][specificField]
                let errorMessage = input.parentNode.querySelector('[data-error-type="jsInjection"]')
                if (!errorMessage) {
                    const elementToClone = input.parentNode.querySelector('[data-error-type="empty"]')
                    errorMessage = elementToClone.cloneNode(true)
                }
                errorMessage.setAttribute('data-error-type', 'jsInjection')
                errorMessage.innerText = 'Script tag is not allowed'
                input.parentNode.appendChild(errorMessage)
                if (input && errorMessage) {
                    input.classList.add('input--error')
                    errorMessage.classList.remove('hidden')
                }
            }
            const isNotInjected = validateScriptInjection(allFormValues[specificField])
            return isNotInjected
        }
        for (let key in allFormValues) {
            if (validateScriptInjection(allFormValues[key])) {
                mandatoryCheckPassed = false
                const input = document.forms[currentformid][key]
                let errorMessage = input.parentNode.querySelector('[data-error-type="jsInjection"]')
                if (!errorMessage) {
                    const elementToClone = input.parentNode.querySelector('[data-error-type="empty"]')
                    errorMessage = elementToClone.cloneNode(true)
                }
                errorMessage.setAttribute('data-error-type', 'jsInjection')
                errorMessage.innerText = 'Script tag is not allowed'
                input.parentNode.appendChild(errorMessage)
                if (input && errorMessage) {
                    input.classList.add('input--error')
                    errorMessage.classList.remove('hidden')
                }
            } else {
                const input = document.forms[currentformid][key]
                const errorMessage = input.parentNode.querySelector('[data-error-type="jsInjection"]')
                if (errorMessage) {
                    input.classList.remove('input--error')
                    errorMessage.classList.add('hidden')
                }
            }
        }
        if (!mandatoryCheckPassed) {
            return mandatoryCheckPassed
        }
    }

    const checkForEmptyInput = (specificField = null) => {
        if (specificField) {
            if (formValues[specificField] === '') {
                mandatoryCheckPassed = false
                const input = document.forms[currentformid][specificField]
                const errorMessage = input.parentNode.querySelector('[data-error-type="empty"]')
                if (input && errorMessage) {
                    input.classList.add('input--error')
                    errorMessage.classList.remove('hidden')
                }
            } else if (formSelect[specificField] === '') {
                mandatoryCheckPassed = false
                const input = document.forms[currentformid].querySelector(`[data-select-name="${specificField}"]`)?.parentNode
                const errorMessage = input.parentNode.querySelector('[data-error-type="empty"]')
                if (input && errorMessage) {
                    input.classList.add('input--error')
                    errorMessage.classList.remove('hidden')
                }
            }
            const isEmpty = formValues[specificField] === '' || formSelect[specificField] === ''
            return isEmpty
        }
        for (let key in formValues) {
            if (formValues[key] === '') {
                mandatoryCheckPassed = false
                const input = document.forms[currentformid][key]
                const errorMessage = input.parentNode.querySelector('[data-error-type="empty"]')

                if (input && errorMessage) {
                    input.classList.add('input--error')
                    errorMessage.classList.remove('hidden')
                }
            }
        }
        for (let key in formSelect) {
            if (formSelect[key] === '') {
                mandatoryCheckPassed = false
                const input = document.forms[currentformid].querySelector(`[data-select-name="${key}"]`)?.parentNode
                const errorMessage = input.parentNode.querySelector('[data-error-type="empty"]')

                if (input && errorMessage) {
                    input.classList.add('input--error')
                    errorMessage.classList.remove('hidden')
                }
            }
        }
    }
    const handleValidateEmail = () => {
        if (formValues.email) {
            if (!validateEmail(formValues.email)) {
                formatCheckPassed = false
                const input = document.forms[currentformid]['email']
                const errorMessage = input.parentNode.querySelector('[data-error-type="invalid"]')
                if (input && errorMessage) {
                    input.classList.add('input--error')
                    errorMessage.classList.remove('hidden')
                }
            }
        }
    }
    const handleValidateMobile = () => {
        if (formValues.mobile) {
            if (!validateMobile(formValues.mobile)) {
                formatCheckPassed = false
                const input = document.forms[currentformid]['mobile']
                const errorMessage = input.parentNode.querySelector('[data-error-type="invalid"]')
                if (input && errorMessage) {
                    input.classList.add('input--error')
                    errorMessage.classList.remove('hidden')
                }
            }
        }
    }
    const handleValidateAgreement = () => {
        if (!formCheckbox.acceptAgreement) {
            mandatoryCheckPassed = false
            const input = document.forms[currentformid]['acceptAgreement']
            const errorMessage = input.parentNode.parentNode.querySelector('[data-error-type="empty"]')
            if (input && errorMessage) {
                input.parentNode.classList.add('input--error')
                errorMessage.classList.remove('hidden')
            }
        }
    }
    if (!injectionOnly && fieldName) {
        resetFormEnquireFormValidationInput(fieldName)
        if (!handleValidateScriptInjection(fieldName)) {
            if (!checkForEmptyInput(fieldName)) {
                if (fieldName === 'email') {
                    handleValidateEmail()
                }
                if (fieldName === 'mobile') {
                    handleValidateMobile()
                }
                if (fieldName === 'acceptAgreement') {
                    handleValidateAgreement()
                }
            }
        }
        return
    }
    if (injectionOnly && fieldName) {
        resetFormEnquireFormValidationInput(fieldName)
        handleValidateScriptInjection(fieldName)
        return
    }
    handleValidateScriptInjection()
    checkForEmptyInput()
    handleValidateEmail()
    handleValidateMobile()
    handleValidateAgreement()
    if (!formCheckbox.acceptAgreement) {
        mandatoryCheckPassed = false
        const input = document.forms[currentformid]['acceptAgreement']
        const errorMessage = input.parentNode.parentNode.querySelector('[data-error-type="empty"]')
        if (input && errorMessage) {
            input.parentNode.classList.add('input--error')
            errorMessage.classList.remove('hidden')
        }
    }
    const payload = {
        ...formValues,
        ...formSelect,
        ...formCheckbox,
    }

    if (mandatoryCheckPassed && formatCheckPassed) {
        callback(payload)
    }
    if (token == '') {
        $('#captcha-error-container').css('display','block');
    }
}

const onChangeResetValidate = () => {
    if (document.forms[currentformid]) {
        const formInput = {
            firstName: document.forms[currentformid]['firstName'],
            lastName: document.forms[currentformid]['lastName'],
            email: document.forms[currentformid]['email'],
            mobile: document.forms[currentformid]['mobile'],
            message: document.forms[currentformid]['message'],
        }
        const formCheckbox = {
            acceptAgreement: document.forms[currentformid]['acceptAgreement'],
        }
        _.forEach(formInput, (item) => {
            item.addEventListener('input', () => {
                resetFormEnquireFormValidationInput(item.name)
            })
            item.addEventListener('focusout', () => {
                validateEnquireForm(() => {}, item.name)
            })
        })
        const optionalFormInput = {
            companyName: document.forms[currentformid]['companyName'],
        }
        _.forEach(optionalFormInput, (item) => {
            item.addEventListener('input', () => {
                resetFormEnquireFormValidationInput(item.name)
            })
            item.addEventListener('focusout', () => {
                validateEnquireForm(() => {}, item.name, true)
            })
        })
        const formSelect = {
            department:
                _.find(getChildNodes(document.forms[currentformid].querySelector('[data-select-name="department"]')), (item) =>
                    item.classList.contains('active')
                )?.dataset?.optionValue || '',
        }
        for (let key in formSelect) {
            const input = document.forms[currentformid].querySelector(`[data-select-name="${key}"]`)?.parentNode
            const errorMessage = input.parentNode.querySelector('[data-error-type="empty"]')
            if (input && errorMessage) {
                input.addEventListener('change', () => {
                    input.classList.remove('input--error')
                    errorMessage.classList.add('hidden')
                })
                input.addEventListener('focusout', () => {
                    validateEnquireForm(() => {}, key)
                })
            }
        }
        formCheckbox.acceptAgreement.addEventListener('change', () => {
            resetFormEnquireFormValidationInput('acceptAgreement')
        })
        formCheckbox.acceptAgreement.parentNode.addEventListener('focusout', () => {
            validateEnquireForm(() => {}, 'acceptAgreement')
        })
    }
}

function sendSuccessMessage(){
    const servletUrl = current_page_split[0] +'/jcr:content.download.json';
    $.ajax({
        type: "POST",
        url: servletUrl,
        dataType: "text",
        success: function(data, textStatus, jqXHR) { },
        error: function(jqXHR) {
            }
        });
}

function downloadAsset(assetPath) {
    if(assetPath.trim()!=''){
        var downloadElement = document.createElement('a');
    downloadElement.setAttribute('href', assetPath);
    downloadElement.setAttribute('download', "");
    downloadElement.style.display = 'none';
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    }
    else{
        console.log("asset not found")
    }
}

// function getCookieValue(){
    
//     return axios.get(current_page_split[0] +'/jcr:content.download.json').then((res)=>{
               
//                 return res.data.cookieValue;
//     })
    
// }

const onSubmitEnquireFormFailed = () => {
    const btn = document.querySelector('#'+currentformid+'-submit-btn')
    const form = document.forms[currentformid]
    openModal(currentformid+'-failure')
}

const onSubmitEnquireFormSuccess = () => {
    const btn = document.querySelector('#'+currentformid+'-submit-btn')
    const form = document.forms[currentformid]

    openModal(currentformid+'-success')

    resetFormEnquireForm()
    btn.disabled = false
    form.style.pointerEvents = ''
    btn.innerText = 'Submit'

    closeModal(currentformid)
}

const handleClickSubmitForm = (e) => {
    const btn = document.querySelector('#'+currentformid+'-submit-btn')
    e.preventDefault()
    validateEnquireForm((payload) => {
        if (token == '') {
            //$('#captcha-error-container').css('display','block');
            return false;
        }
        btn.innerText = 'Loading'
        btn.disabled = true
        const form = document.forms[currentformid]
        form.style.pointerEvents = 'none'
        var formId = $('#formid').val();
                var subject = $('#emailsubject').val();
                var resourcePath=$('#resourcePath').val();
               
                    formObj = {
                            formId: formId,
                            subject: subject,
                            firstName: payload.firstName,
                            lastName: payload.lastName,
                            mobile: payload.mobile,
                            company: document.forms[currentformid]['companyName'].value,
                            department: payload.department,
                            comments: payload.message,
                            userEmail: payload.email,
                            resourcePath: resourcePath,
                            token:token
                        }
                       
                        const servletUrl = current_page_split[0] +'/jcr:content.email.json';
                        $.ajax({
                            type: "POST",
                            url: servletUrl,
                            data: formObj,
                            dataType: "text",
                            success: function(data, textStatus, jqXHR) {

                                grecaptcha.reset();

                                //For loading 
                                onSubmitEnquireFormSuccess()
                                
                                //openModal(currentformid+'-success')
                                
                                if(hrefPath!="" && cookieAttribute=='download-Cookie'){
                                    sendSuccessMessage();
                                    downloadAsset(hrefPath);
                                }
                                
                                
                            },
                            error: function(jqXHR) {
                                grecaptcha.reset();
                                onSubmitEnquireFormFailed()
                                //openModal(currentformid+'-failure')
                            }
                        });
    })
}

const handleShortcut = (e) => {
    const shortCut = document.querySelector('#'+currentformid+'-shortcut-email')
    if (e.keyCode === 13) {
        // Cancel the default action, if needed
        e.preventDefault()
        // Trigger the button element with a click
        const btn = document.querySelector('[data-open-modal-btn="'+currentformid+'"][data-open-modal-auto-fill="email"]')
        if (btn) {
            const autoFillFormValues = btn.dataset.openModalAutoFill
            const autoFillForm = _.compact(_.split(autoFillFormValues, ' '))
            if (autoFillForm) {
                const receivedValues = _.map(autoFillForm, (item) => {
                    const input = btn.parentNode.querySelector(`input[name="${item}"]`)
                    let value	
                    value = input.value	
                    input.value = ''
                    return {
                        name: item,
                        value,
                    }
                })
                openModal(btn.dataset.openModalBtn, receivedValues)
            }
        }
    }
}
const __initEnquireFormSubmitBtn = () => {
    const btn = document.querySelector('#'+currentformid+'-submit-btn')
    if (btn) {
        btn.removeEventListener('click', handleClickSubmitForm, true)
        btn.addEventListener('click', handleClickSubmitForm, true)
    }
    const shortCut = document.querySelector('#'+currentformid+'-shortcut-email')
    if (shortCut) {
        shortCut.removeEventListener('keyup', handleShortcut, true)
        shortCut.addEventListener('keyup', handleShortcut, true)
    }
}
(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initModal()
            
             console.log('Enquire form script imported')
        }
    }, 100)
})()
