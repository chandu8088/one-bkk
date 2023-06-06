'use strict'

// import { getChildNodes } from './core.js'

const __initCustomSelect = () => {
    const select = document.querySelectorAll('.custom-select__active-option')

    const handleOnSelect = (selector, options, seletedOption) => {
        _.forEach(options, (item) => {
            if (item.dataset.optionValue === seletedOption) {
                item.classList.add('active')
                selector.querySelector('.custom-select__active-option-value').innerHTML = item.dataset.optionValue
            } else {
                item.classList.remove('active')
            }
        })
    }
    _.forEach(select, (selector, index) => {
        const options = selector.nextElementSibling
        selector.addEventListener('click', () => {
            options.classList.add('toggled')
        })
        const childNodes = getChildNodes(options)
        _.forEach(childNodes, (item, index) => {
            item.addEventListener('click', () => {
                options.classList.remove('toggled')
                handleOnSelect(selector, childNodes, item.dataset.optionValue)
            })
        })
        window.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                options.classList.remove('toggled')
            }
        })
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initCustomSelect()
            console.log('Overriding script imported')
        }
    }, 100)
})()
