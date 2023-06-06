'use strict'

// import { htmlToElement } from './core.js'

const __initCheckboxes = () => {
    const checkboxes = document.querySelectorAll('[type="checkbox"]')

    _.forEach(checkboxes, (actualCheckbox) => {
        const newCheckbox = htmlToElement(
            `<div class="custom-checkbox ${
                actualCheckbox.checked ? 'checked' : ''
            }"><svg width="10" height="7" viewBox="0 0 10 7" xmlns="http://www.w3.org/2000/svg"> <path d="M9.772 1.324 4.159 6.772a.81.81 0 0 1-1.125 0l-2.8-2.741a.759.759 0 0 1 0-1.097.81.81 0 0 1 1.125 0l2.25 2.194 5.05-4.9a.81.81 0 0 1 1.125 0c.3.303.3.793-.012 1.096z" fill="#000" fill-rule="evenodd"/></svg></div>`
        )

        actualCheckbox.style.display = 'none'

        newCheckbox.addEventListener('click', () => {
            actualCheckbox.click()
            newCheckbox.focus()

            if (actualCheckbox.checked) {
                newCheckbox.classList.add('checked')
            } else {
                newCheckbox.classList.remove('checked')
            }
        })
        newCheckbox.addEventListener('keypress', () => {
            actualCheckbox.click()

            if (actualCheckbox.checked) {
                newCheckbox.classList.add('checked')
            } else {
                newCheckbox.classList.remove('checked')
            }
        })

        actualCheckbox.parentNode.insertBefore(newCheckbox, actualCheckbox)

        actualCheckbox.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                newCheckbox.classList.add('checked')
            } else {
                newCheckbox.classList.remove('checked')
            }
        })
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initCheckboxes()
            console.log('Checkbox script imported')
        }
    }, 100)
})()
