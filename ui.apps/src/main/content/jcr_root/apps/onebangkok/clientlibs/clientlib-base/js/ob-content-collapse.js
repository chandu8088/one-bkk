'use strict'

const __initContentCollapse = () => {
    const toggleBtns = document.querySelectorAll('.content-collapse-toggle-btn')
    _.forEach(toggleBtns, (btn) => {
        btn.addEventListener('click', () => {
            const collapse = btn.parentNode

            if (collapse.classList.contains('active')) {
                collapse.classList.remove('active')
                btn.classList.remove('reverse')
            } else {
                collapse.classList.add('active')
                btn.classList.add('reverse')

                const colRect = collapse.parentNode.getBoundingClientRect()

                window.scrollBy({ top: colRect.bottom - window.innerHeight, behavior: 'smooth' })
            }
        })
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initContentCollapse()
            console.log('Content collapse script imported')
        }
    }, 100)
})()
