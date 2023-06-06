'use strict'

// import { htmlToElement, getChildNodes } from './core.js'

const __initButton = () => {
    const buttons = document.querySelectorAll('a.button', 'button.button')
    _.forEach(buttons, (item) => {
        const cloned = item.cloneNode(true)
        const fragment = document.createDocumentFragment()

        const newText = htmlToElement(`<span>${cloned.innerText.trim()}</span>`)
        fragment.appendChild(newText)

        _.forEach(getChildNodes(item), (child) => {
            fragment.append(child)
        })

        const span = document.createElement('span')
        span.appendChild(fragment)
        item.textContent = ''
        item.appendChild(span)
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initButton()
            console.log('Overriding script imported')
        }
    }, 100)
})()
