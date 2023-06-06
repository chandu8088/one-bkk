'use strict'

// import { getChildNodes } from './core.js'

const onHistoryChange = new Event('onHistoryChange')

const __initDataContentGroup = () => {
    const contentGroups = document.querySelectorAll('[data-content-group]')
    _.forEach(contentGroups, (item) => {
        const targetContents = item.querySelectorAll('[data-content-id]')

        const toggleDataContent = (contentTargetValue) => {
            const targetIndex = _.findIndex(targetContents, (item) => item.dataset.contentId === contentTargetValue)
            _.forEach(targetContents, (content, index) => {
                if (content.dataset.contentId !== contentTargetValue) {
                    content.classList.remove('data-content--active')
                    content.classList.add('data-content--inactive')
                } else {
                    content.classList.remove('data-content--inactive')
                    content.classList.add('data-content--active')
                }
            })
            document.dispatchEvent(onHistoryChange)
        }

        const buttons = item.querySelectorAll('[data-content-target]')
        _.forEach(buttons, (button) => {
            button.addEventListener('click', () => {
                _.forEach(buttons, (button) => {
                    button.classList.remove('data-content-button--active')
                })
                button.classList.add('data-content-button--active')
                toggleDataContent(button.dataset.contentTarget)
            })
        })

        const controlContents = item.querySelectorAll('[data-content-control]')
        _.forEach(controlContents, (control) => {
            if (control.dataset.contentControl === 'prev') {
                control.addEventListener('click', (e) => {
                    e.preventDefault()
                    const currentActive = _.findIndex(buttons, (item) => {
                        return item.classList.contains('data-content-button--active')
                    })
                    if (currentActive !== 0) {
                        _.forEach(buttons, (button) => {
                            button.classList.remove('data-content-button--active')
                        })
                        const nextActive = buttons[currentActive - 1]
                        toggleDataContent(nextActive.dataset.contentTarget)
                        nextActive.classList.add('data-content-button--active')
                    } else {
                        _.forEach(buttons, (button) => {
                            button.classList.remove('data-content-button--active')
                        })
                        const nextActive = buttons[_.size(buttons) - 1]
                        toggleDataContent(nextActive.dataset.contentTarget)
                        nextActive.classList.add('data-content-button--active')
                    }
                    if (control.classList.contains('site-history__control-prev')) {
                        __reinitHistoryButtonsRendering(true)
                    }
                    document.dispatchEvent(onHistoryChange)
                })
            }
            if (control.dataset.contentControl === 'next') {
                control.addEventListener('click', (e) => {
                    e.preventDefault()
                    const currentActive = _.findIndex(buttons, (item) => {
                        return item.classList.contains('data-content-button--active')
                    })
                    if (currentActive !== _.size(buttons) - 1) {
                        _.forEach(buttons, (button) => {
                            button.classList.remove('data-content-button--active')
                        })
                        const nextActive = buttons[currentActive + 1]
                        toggleDataContent(nextActive.dataset.contentTarget)
                        nextActive.classList.add('data-content-button--active')
                    } else {
                        _.forEach(buttons, (button) => {
                            button.classList.remove('data-content-button--active')
                        })
                        const nextActive = buttons[0]
                        toggleDataContent(nextActive.dataset.contentTarget)
                        nextActive.classList.add('data-content-button--active')
                    }
                    if (control.classList.contains('site-history__control-next')) {
                        __reinitHistoryButtonsRendering(true)
                    }
                    document.dispatchEvent(onHistoryChange)
                })
            }
        })
    })
}

const __initHistorySwiper = () => {
    const historyWrapper = document.querySelectorAll('.site-history__content-wrapper')

    _.forEach(historyWrapper, (history) => {
        const debounceChangeImage = _.debounce(() => {
            const pagination = history.parentNode.querySelector('.pagination')

            _.forEach(getChildNodes(history), (year) => {
                const activeYear = year.querySelector('.site-history__year')
                if (isInView(activeYear)) {
                    const parent = history.parentNode.parentNode
                    const imageWrapper = parent.querySelectorAll('[data-show-on-pagination]')

                    const dots = getChildNodes(pagination)

                    _.forEach(dots, (item) => {
                        item.classList.remove('active')
                    })

                    _.forEach(imageWrapper, (item, index) => {
                        if (item.dataset.contentId !== activeYear.parentNode.dataset.contentId) {
                            item.classList.add('data-content--inactive')
                            item.classList.remove('data-content--active')
                        } else {
                            item.classList.add('data-content--active')
                            item.classList.remove('data-content--inactive')
                            dots[index]?.classList.add('active')
                        }
                    })
                }
            })
            document.dispatchEvent(onHistoryChange)
        }, 250)
        history.addEventListener('scroll', () => {
            debounceChangeImage()
        })
    })
}

const __reinitHistoryButtonsRendering = (reinit = false) => {
    const buttonsGroup = document.querySelectorAll('.site-history__control-item-group')

    _.forEach(buttonsGroup, (group) => {
        const buttons = getChildNodes(group)
        if (_.size(buttons) > 6) {
            if (!reinit) {
                _.forEach(buttons, (button, index) => {
                    index < 6 && button.classList.add('shown')
                })
            } else {
                const currentActiveButton = _.find(buttons, (button) => button.classList.contains('data-content-button--active'))

                if (currentActiveButton.classList.contains('shown')) {
                    return
                } else {
                    const currentIndex = _.findIndex(buttons, (button) => button.classList.contains('data-content-button--active'))

                    const findNearest = () => {
                        return buttons[currentIndex - 1].classList.contains('shown') ? currentIndex - 1 : currentIndex + 1
                    }

                    const nearestShown = currentIndex == 0 ? 1 : currentIndex === _.size(buttons) - 1 ? _.size(buttons) - 2 : findNearest()

                    _.forEach(buttons, (button, index) => {
                        const leftSide = currentIndex - nearestShown > 0

                        if (leftSide) {
                            const starter = currentIndex - 6
                            if (index > starter && index <= currentIndex) {
                                button.classList.add('shown')
                            } else {
                                button.classList.remove('shown')
                            }
                        } else {
                            const end = currentIndex + 6
                            if (index >= currentIndex && index < end) {
                                button.classList.add('shown')
                            } else {
                                button.classList.remove('shown')
                            }
                        }
                    })
                }
            }
        }
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initDataContentGroup()
            __initHistorySwiper()
            __reinitHistoryButtonsRendering()
            console.log('History interaction script imported')
        }
    }, 100)
})()
