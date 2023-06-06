'use strict'

const __initAOS = () => {
    console.log('initAOS')
    if (typeof AOS !== 'undefined') {
        AOS.init({
            startEvent: 'pageLoaded',
            duration: 750,
            easing: 'ease',
            mirror: false,
            once: true,
            anchorPlacement: 'center-bottom',
        })
        const deboucedRefreshAOS = _.debounce(
            () => {
                AOS.refresh()
                console.log('AOS refresh')
            },
            500,
            { maxWait: 1000 }
        )
        const resizeObserver = new ResizeObserver(() => {
            deboucedRefreshAOS.cancel()
            deboucedRefreshAOS()
        })
        resizeObserver.observe(document.body)
    }
}

const requireFile = (url) => {
    const path = document.currentScript.src.replace('/app.js', url)

    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = path
    s.async = false
    document.body.appendChild(s)
}
// requireFile('/core.js')

// requireFile('/ob-pageLoad.js')
// requireFile('/tween.js')
// requireFile('/jarallax.js')

// requireFile('/ob-top-banner.js')
// requireFile('/ob-content-collapse.js')
// requireFile('/ob-navigation.js')
// requireFile('/ob-social-media-image.js')
// requireFile('/ob-button.js')
// requireFile('/ob-select.js')
// requireFile('/ob-tabs.js')
// requireFile('/ob-dropdown.js')
// requireFile('/ob-checkbox.js')
// requireFile('/ob-carousel.js')
// requireFile('/ob-pagination.js')
// requireFile('/ob-content-listing.js')
// requireFile('/ob-content-listing-report.js')
// requireFile('/ob-content-detailed.js')
// requireFile('/ob-circle-button-interaction.js')
// requireFile('/ob-full-screen-banner.js')
// requireFile('/ob-full-width-banner.js')
// requireFile('/ob-history-interaction.js')
// requireFile('/ob-3d-building-observer.js')
// requireFile('/ob-modal.js')
// requireFile('/ob-enquire-form.js')
// requireFile('/ob-snackbar.js')
// requireFile('/ob-override.js')
// requireFile('/ob-animator.js')

// import './ob-top-banner.js'
// import './ob-content-listing.js'
// import './ob-content-listing-report.js'
// import './ob-content-collapse.js'
// import './ob-navigation.js'
// import './ob-social-media-image.js'
// import './ob-button.js'
// import './ob-select.js'
// import './ob-tabs.js'
// import './ob-dropdown.js'
// import './ob-checkbox.js'
// import './ob-carousel.js'
// import './ob-pagination.js'
// import './ob-content-detailed.js'
// import './ob-circle-button-interaction.js'
// import './ob-full-screen-banner.js'
// import './ob-full-width-banner.js'
// import './ob-history-interaction.js'
// import './ob-modal.js'
// import './ob-enquire-form.js'
// import './ob-snackbar.js'
// import './ob-override.js'
// import './ob-animator.js'

// --- START DEVELOPMENT ONLY ---
// --- END DEVELOPMENT ONLY ---

const initApplication = () => {
    // --- START DEV ONLY ---
    console.log('v0.8-dev68')
    __initAOS()
}

// START DEV POC ONLY ----
// START DEV POC ONLY ----
// START DEV POC ONLY ----

// window.addEventListener(
//     'message',
//     (event) => {
//         // Safe Cross Origin if needed
//         // if (event.origin !== 'http://127.0.0.1:5501') return
//         if (event.data) {
//             const [eventType, dataId] = event.data.split(':')

//             if (eventType === 'iframeContentTriggerId' && dataId) {
//                 const targetContent = document.querySelector(`[data-iframe-content-trigger-id=${dataId}]`)

//                 if (targetContent) {
//                     const group = targetContent.parentNode
//                     if (group) {
//                         console.log(`eventType: ${eventType}, recieved data-iframe-content-trigger-id: ${dataId}`)
//                         const allContent = group.querySelectorAll('[data-iframe-content-trigger-id]')
//                         _.forEach(allContent, (contentGroup) => {
//                             if (contentGroup.dataset.iframeContentTriggerId !== dataId) {
//                                 contentGroup.style.display = 'none'
//                             } else {
//                                 contentGroup.style.removeProperty('display')
//                             }
//                         })
//                     }
//                 } else {
//                     console.log(`eventType: ${eventType}, recieved invalid data-iframe-content-trigger-id`)
//                 }
//             }
//         }
//     },
//     false
// )

// END DEV POC ONLY ----
// END DEV POC ONLY ----
// END DEV POC ONLY ----

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        initApplication()
    }
}

window.onbeforeunload = () => {
    // window.scrollTo(0, 0)
}
