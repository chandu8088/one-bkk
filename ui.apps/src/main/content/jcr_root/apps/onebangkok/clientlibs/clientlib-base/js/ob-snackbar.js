'use strict'

let snackbarStates = []

const __initQuestionSnackbar = () => {
    const snackbar = document.querySelectorAll('.snackbar')
    _.forEach(snackbar, (item, index) => {
        const SNACKBAR_STATES = {
            READY: 'READY',
            OPEN: 'OPEN',
            CLOSED_BY_USER: 'CLOSED_BY_USER',
        }
        snackbarStates.push(SNACKBAR_STATES.READY)
        const closeBtn = item.querySelector('.snackbar__close')
        closeBtn.addEventListener('click', () => {
            item.classList.remove('open')
            snackbarStates[index] = SNACKBAR_STATES.CLOSED_BY_USER
        })
        window.addEventListener('scroll', () => {
            if (window.scrollY > document.body.clientHeight / 2 && snackbarStates[index] !== SNACKBAR_STATES.CLOSED_BY_USER) {
                item.classList.add('open')
                snackbarStates[index] = SNACKBAR_STATES.OPEN
            }
        })
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initQuestionSnackbar()
            console.log('Snackbar script imported')
        }
    }, 100)
})()
