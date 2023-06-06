'use strict'
'use strict'

// import { getChildNodes } from './core.js'

const __initCircularMenu = () => {
    const dataButtonGroup = document.querySelectorAll('[data-button-group]')

    _.forEach(dataButtonGroup, (item) => {
        const imageThumb = item.querySelector('.circle-button-wrapper__content-image')

        const resetContentDetail = () => {
            const btns = item.querySelectorAll('button[data-content-id]')
            const resetContentDetail = item.querySelectorAll(`[class*="circle-button-wrapper__content-details"]`)
            _.forEach(resetContentDetail, (item) => {
                item.classList.remove('active')
            })
            _.forEach(btns, (item) => {
                item.classList.remove('active')
            })
        }
        const toggleContent = (contentId, btn) => {
            const contentDetail = item.querySelector(`[class*="circle-button-wrapper__content-details"][data-content-id=${contentId}]`)
            if (contentDetail.classList.contains('active')) {
                btn.classList.remove('active')
                imageThumb.classList.add('active')
                contentDetail.classList.remove('active')
            } else {
                resetContentDetail()
                btn.classList.add('active')
                imageThumb.classList.remove('active')
                contentDetail.classList.add('active')
            }
        }

        const closeContent = () => {
            resetContentDetail()
            imageThumb.classList.add('active')
        }

        const btns = item.querySelectorAll('button[data-content-id]')

        _.forEach(btns, (oldBtn) => {
            const newBtn = oldBtn.cloneNode(true)
            oldBtn.parentNode.insertBefore(newBtn, oldBtn)
            oldBtn.remove()
        })

        const newBtns = item.querySelectorAll('button[data-content-id]')

        _.forEach(newBtns, (item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault()
                toggleContent(item.dataset.contentId, item)
            })
        })

        const closes = item.querySelectorAll('.circle-button-wrapper__content-close')

        _.forEach(closes, (oldBtn) => {
            const newBtn = oldBtn.cloneNode(true)
            oldBtn.parentNode.insertBefore(newBtn, oldBtn)
            oldBtn.remove()
        })

        const newCloses = item.querySelectorAll('.circle-button-wrapper__content-close')

        const handleClose = (e) => {
            e.preventDefault()
            closeContent()
        }

        _.forEach(newCloses, (item) => {
            item.addEventListener('click', handleClose)
        })
    })

    AOS.refreshHard()
    // RULES
    // angle > 15 = show on right
    // angle > 180 = show on top
}

const __initCircleButtonPosition = () => {
    const safeOffset = window.innerWidth < 676 ? 10 : 0
    const dataButtonGroup = document.querySelectorAll('[data-button-group]')
    _.forEach(dataButtonGroup, (item) => {
        var radius = item.offsetHeight / 2
        const findXY = (angle) => {
            const x = radius * Math.sin((Math.PI * 2 * angle) / 360)
            const y = radius * Math.cos((Math.PI * 2 * angle) / 360)
            const offsetX = Math.round(x * 100) / 100
            const offsetY = Math.round(y * 100) / 100
            return { x: offsetX > 0 ? offsetX + safeOffset : offsetX - safeOffset, y: offsetY > 0 ? offsetY + safeOffset : offsetY - safeOffset }
        }

        _.forEach(getChildNodes(item), (item) => {
            const { x, y } = findXY(item.dataset.buttonPosition)
            item.style.transform = `translate(${x}px, ${y}px)`
        })
    })

    const dataButton = document.querySelectorAll('[data-button-position]')

    _.forEach(dataButton, (item) => {
        const angle = item.dataset.buttonPosition
        const btnDescription = item.querySelector('.circle-button-icon-description')
        if (angle > 315 || angle < 45) {
            btnDescription.classList.add('circle-button--bottom')
        } else if (angle >= 45 && angle <= 135) {
            // ALLOW 45-66 and 114-135
            if (angle < 67) {
                btnDescription.classList.add('circle-button--right-bottom')
            } else if (angle > 113) {
                btnDescription.classList.add('circle-button--right-top')
            } else {
                btnDescription.classList.add('circle-button--right')
            }
        } else if (angle > 135 && angle < 225) {
            btnDescription.classList.add('circle-button--top')
        } else if (angle >= 225 && angle <= 315) {
            if (angle < 249) {
                btnDescription.classList.add('circle-button--left-top')
            } else if (angle > 292) {
                btnDescription.classList.add('circle-button--left-bottom')
            } else {
                btnDescription.classList.add('circle-button--left')
            }
        }

        btnDescription.innerText = btnDescription.innerText.trim()

        const spanText = htmlToElement(`<div>${btnDescription.innerText}</div>`)
        btnDescription.innerText = ''
        btnDescription.appendChild(spanText)

        item.classList.add('ready')
    })
    AOS.refreshHard()
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)

            __initCircleButtonPosition()
            __initCircularMenu()

            window.addEventListener('resize', () => {
                __initCircularMenu()
                __initCircleButtonPosition()
            })

            // Listen for the event.
            document.addEventListener(
                'obTabChanged',
                function (e) {
                    __initCircleButtonPosition()
                },
                false
            )

            console.log('Circle button interaction script imported')
        }
    }, 100)
})()
