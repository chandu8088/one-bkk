'use strict'

// import { getChildNodes } from './core.js'

const __initCustomDropdown = () => {
    const change = new Event('change')
    const select = document.querySelectorAll('.custom-dropdown__active-item')

    const handleOnSelect = (selector, options, seletedOption) => {
        selector.parentNode.dispatchEvent(change)
        selector.setAttribute('aria-activedescendant', seletedOption)
        _.forEach(options, (item) => {
            if (item.dataset.optionValue === seletedOption) {
                item.classList.add('active')
                item.setAttribute('aria-selected', 'true')
                selector.querySelector('.custom-dropdown__active-option-value').innerHTML = item.dataset.optionName
            } else {
                item.setAttribute('aria-selected', 'false')
                item.classList.remove('active')
            }
        })
    }
    _.forEach(select, (selector, index) => {
        const options = selector.nextElementSibling

        _.forEach(getChildNodes(options), (item) => {
            if (item.classList.contains('active')) {
                selector.querySelector('.custom-dropdown__active-option-value').innerHTML = item.dataset.optionName
            }
        })

        const toggleOption = () => {
            options.classList.add('toggled')
            const optionsItem = options.querySelectorAll('.custom-dropdown__item:not(.custom-dropdown__label)')
            _.forEach(optionsItem, (option) => {
                option.setAttribute('tabindex', '0')
            })
        }

        const closeOption = () => {
            options.classList.remove('toggled')
            const optionsItem = options.querySelectorAll('.custom-dropdown__item:not(.custom-dropdown__label)')
            _.forEach(optionsItem, (option) => {
                option.setAttribute('tabindex', '-1')
            })
        }

        selector.addEventListener('click', () => {
            toggleOption()
        })
        selector?.parentNode?.addEventListener('keypress', () => {
            toggleOption()
        })

        const handleSelected = (item) => {
            const placeholder = item.parentNode.parentNode.querySelector('.custom-dropdown__placeholder')
            if (placeholder) placeholder.style.display = 'none'

            const activeOptionPlaceholder = item.parentNode.parentNode.querySelector('.custom-dropdown__active-option-value')
            if (activeOptionPlaceholder) activeOptionPlaceholder.style.display = 'inline-block'

            closeOption()
            handleOnSelect(selector, getChildNodes(options), item.dataset.optionValue)
        }

        _.forEach(getChildNodes(options), (item, index) => {
            item.addEventListener('click', () => {
                handleSelected(item)
            })
            item.addEventListener('keypress', (e) => {
                e.stopPropagation()
                handleSelected(item)
            })
        })
        window.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                closeOption()
            }
        })
    })

    const options = document.querySelectorAll('.custom-dropdown__options')
    _.forEach(options, (option) => {
        const isOneActive = _.map(getChildNodes(option), (item) => {
            return item.classList.contains('active')
        })

        if (_.includes(isOneActive, true)) {
            const placeholder = option.parentNode.querySelector('.custom-dropdown__placeholder')
            if (placeholder) placeholder.style.display = 'none'
        } else {
            // const placeholder = option.parentNode.querySelector('.custom-dropdown__active-option-value')
            // if (placeholder) placeholder.style.display = 'none'
        }
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initCustomDropdown()

            // Listen for the event.
            document.addEventListener(
                'onFilterChanged',
                function (e) {
                    __initCustomDropdown()
                },
                false
            )

            console.log('Dropdown script imported')
        }
    }, 100)
})()
