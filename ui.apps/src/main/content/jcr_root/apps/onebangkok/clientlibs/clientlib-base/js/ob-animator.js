'use strict'

// import { getChildNodes, isInView, isMobileView } from './core.js'

const animateEaseValue = (el, callback) => {
    const animationDuration = 3500
    const frameDuration = 1000 / 60
    const totalFrames = Math.round(animationDuration / frameDuration)
    const easeOutQuad = (t) => t * (2 - t)

    let frame = 0
    const countTo = parseInt(100)
    // Start the animation running 60 times per second
    const counter = setInterval(() => {
        frame++
        const progress = easeOutQuad(frame / totalFrames)
        // Use the progress value to calculate the current count
        const currentCount = Math.round(countTo * progress)
        // If we’ve reached our last frame, stop the animation
        if (frame === totalFrames) {
            clearInterval(counter)
        }
        if (!el.classList.contains('animate-masking-running')) {
            clearInterval(counter)
        }
        callback(currentCount)
    }, frameDuration)
}

const convertRange = (value, [oldMin, oldMax], [newMin, newMax]) => {
    if (oldMin != oldMax && newMin != newMax) {
        return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
    } else {
        return (newMax + newMin) / 2
    }
}

animateTweenCircle()
function animateTweenCircle(time) {
    requestAnimationFrame(animateTweenCircle)
    TWEEN.update(time)
}

const animatingMaskingCircle = (item) => {
    if (!item?.classList.contains('animate-masking-done')) {
        if (isInView(item) && !item.classList.contains('animate-masking-running')) {
            item.classList.add('animate-masking-running')

            const value = { scale: 0 }
            const transition = new TWEEN.Tween(value)
                .to({ scale: 100 }, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    item.style.opacity = `${(value.scale * 1) / 100}`
                    item.style['clip-path'] = `circle(${value.scale}%)`
                })

            const isReveal = document.body.dataset.pageReveal === 'animated'
            if (isReveal) {
                setTimeout(() => {
                    transition.start()
                }, 500)
            } else {
                transition.start()
            }

            setTimeout(() => {
                item.classList.remove('animate-masking-running')
                item.classList.add('animate-masking-done')
            }, 2000)
        }
    }
}

const animatingMaskingSquareLeft = (container, item) => {
    const offsetHeight = container.offsetHeight
    const elRect = container.getBoundingClientRect()
    const elRectTop = elRect.top
    const opacity = elRectTop <= 0 ? (elRectTop * -1.5) / (offsetHeight / 100) / 100 : 0
    const clipValue = opacity < 1 ? opacity : 1

    item.style['clip-path'] = `inset(0 ${100 - clipValue * 100}% 0 0)`
}

const updateElementScrollAnimate = (els) => {
    _.forEach(els, (item) => {
        if (isInView(item)) {
            const rect = item.getBoundingClientRect()

            const centering = rect.top - window.innerHeight / 2 + rect.height / 2

            let range = [0, 0]

            if (item.dataset.scrollAnimate == '5') {
                range = [-65, 65]
            } else if (item.dataset.scrollAnimate == '4') {
                range = [-50, 50]
            } else if (item.dataset.scrollAnimate == '2') {
                range = [-15, 15]
            }

            const newValue = convertRange(centering, [(window.innerHeight / 2) * -1, window.innerHeight / 2], range)

            item.style.transform = `translateY(${newValue}px)`
            item.classList.add('animate-scroll-init')
        }
    })
}

const __initDataScrollAnimate = () => {
    const animateScrollItems = document.querySelectorAll('[data-scroll-animate]')

    updateElementScrollAnimate(animateScrollItems)
    window.removeEventListener('scroll', () => updateElementScrollAnimate(animateScrollItems), true)
    window.addEventListener('scroll', () => updateElementScrollAnimate(animateScrollItems), true)
    document.removeEventListener('obTabChanged', () => updateElementScrollAnimate(animateScrollItems), true)
    document.addEventListener('obTabChanged', () => updateElementScrollAnimate(animateScrollItems), true)
}

const updateElementPositionAniamte = (els) => {
    _.forEach(els, (item) => {
        if (isInView(item)) {
            const rect = item.getBoundingClientRect()
            const centering = rect.top - window.innerHeight / 2 + rect.height / 2
            item.classList.add('animate-scroll-init')

            let range = [0, 0]

            if (item.dataset.scrollAnimatePosition === 'top') {
                range = [0, 35]
            } else if (item.dataset.scrollAnimatePosition === 'middle') {
                range = [0, 0]
            } else if (item.dataset.scrollAnimatePosition === 'bottom') {
                range = [0, -20]
            }

            const newValue = convertRange(centering < 0 ? 0 : centering, [0, window.innerHeight / 2], range)

            if (item.dataset.scrollAnimatePosition === 'top') {
                item.style.transform = `translateY(${newValue}px)`
            }
            if (item.dataset.scrollAnimatePosition === 'middle') {
                item.style.transform = `translateY(${newValue}px)`
            }
            if (item.dataset.scrollAnimatePosition === 'bottom') {
                item.style.transform = `translateY(${newValue}px)`
            }
        }
    })
}

const __initDataScrollAnimatePosition = () => {
    const animateScrollItems = document.querySelectorAll('[data-scroll-animate-position]')

    updateElementPositionAniamte(animateScrollItems)
    window.removeEventListener('scroll', () => updateElementPositionAniamte(animateScrollItems), true)
    window.addEventListener('scroll', () => updateElementPositionAniamte(animateScrollItems), true)
    document.removeEventListener('obTabChanged', () => updateElementPositionAniamte(animateScrollItems), true)
    document.addEventListener('obTabChanged', () => updateElementPositionAniamte(animateScrollItems), true)
}

const maskingCircle = () => {
    const animateMasking = document.querySelectorAll('[data-animate-masking]')
    _.forEach(animateMasking, (item) => {
        if (!item.classList.contains('animate-masking-done')) {
            item.style['clip-path'] = `circle(0%)`
        }
        if (item?.dataset?.animateMasking === 'circle-center') {
            animatingMaskingCircle(item)
        }
    })
}

const maskingSquare = () => {
    const animateMaskingParallax = document.querySelectorAll('.container--parallax')
    _.forEach(animateMaskingParallax, (container) => {
        const animateMaskings = container.querySelectorAll('[data-animate-masking-parallax]')
        _.forEach(animateMaskings, (item) => {
            if (item.dataset.animateMaskingParallax === 'square-left') {
                animatingMaskingSquareLeft(container, item)
            }
        })
    })
}

const animateParallax = () => {
    const parallaxContainer = document.querySelectorAll('.container--parallax')
    _.forEach(parallaxContainer, (container) => {
        const maskingEl = container.querySelector('[data-animate-masking-parallax]')
        const target = _.first(getChildNodes(container))
        if (target && maskingEl) {
            const updateParallaxContainerPosition = () => {
                const imageScrollWrapper = target?.querySelector('.image-scroll')
                const imageBehind = imageScrollWrapper?.querySelector('.image-scroll__behind')

                const wrapper = imageScrollWrapper.parentNode.parentNode
                const parallaxWrapper = wrapper.parentNode

                const isUnderHistory =
                    !!parallaxWrapper?.previousElementSibling?.querySelector('.site-history__control') ||
                    !!parallaxWrapper?.parentNode?.previousElementSibling?.querySelector('.site-history__control')

                if (isMobileView) {
                    wrapper.style.marginTop = '0'
                    wrapper.style.marginBottom = '96px'
                    wrapper.style.maxHeight = 'calc(100vh - 80px - 80px)'
                } else {
                    wrapper.style.marginTop = '96px'
                    wrapper.style.marginBottom = '96px'
                    wrapper.style.maxHeight = 'calc(100vh - 96px - 96px)'
                }

                wrapper.style.height = '100vh'
                wrapper.style.display = 'flex'
                wrapper.style.alignItems = 'center'
                wrapper.style.justifyContent = 'center'
                wrapper.style.transition = 'transform 0ms linear'

                const negativeOffsetValueTop = isUnderHistory ? imageBehind.offsetTop + 96 / 2 - 69 : imageBehind.offsetTop + 96 / 2
                const negativeOffsetValueBottom = isUnderHistory ? imageBehind.offsetTop + 96 / 2 : imageBehind.offsetTop + 96 / 2
                if (isMobileView) {
                    parallaxWrapper.style.marginTop = `${negativeOffsetValueTop * -1}px`
                    const preventOverlap = parallaxWrapper?.nextElementSibling?.classList.contains('container--background-fullwidth')
                    if (preventOverlap) {
                        const foundOverlapContainer = parallaxWrapper?.nextElementSibling?.classList.contains(
                            'container--background-fullwidth--overlap'
                        )
                        if (foundOverlapContainer) {
                            const basicValue = negativeOffsetValueBottom * -1
                            parallaxWrapper.style.marginBottom = `${basicValue + 144 + 96 + 24}px`
                        }
                    } else {
                        parallaxWrapper.style.marginBottom = `${negativeOffsetValueBottom * -1}px`
                    }
                } else {
                    parallaxWrapper.style.marginTop = ''
                    parallaxWrapper.style.marginBottom = ''
                }
                // parallaxWrapper.style.marginBottom = `${imageBehind.offsetTop * -1}px`

                target.style.position = 'fixed'
                imageScrollWrapper.style.opacity = 1
            }

            const updateParallaxContainer = () => {
                const imageScrollWrapper = target.querySelector('.image-scroll')

                const wrapper = imageScrollWrapper.parentNode.parentNode
                const parallaxWrapper = wrapper.parentNode

                const isUnderHistory = parallaxWrapper.previousElementSibling.querySelector('.site-history__control')

                const offsetTop = isUnderHistory
                    ? isMobileView
                        ? (window.innerHeight / 2 - maskingEl.getBoundingClientRect().height / 2) / 1
                        : window.innerHeight / 2 - maskingEl.getBoundingClientRect().height / 2
                    : isMobileView
                    ? (window.innerHeight / 2 - maskingEl.getBoundingClientRect().height / 2) / 1
                    : 144

                const parentRect = target.parentNode.getBoundingClientRect()
                const reachingTop = parentRect.top - offsetTop + (isMobileView ? 0 : 0)

                const reachingBottom = parentRect.bottom - window.innerHeight + offsetTop

                target.style.top = isMobileView ? offsetTop + 'px' : '0px'

                if (reachingTop >= 0 && !reachingBottom <= 0) {
                    target.style.transform = `translateY(${reachingTop}px)`
                    if (isMobileView) {
                        // imageScrollWrapper.style.transform = 'translateY(80px)'
                    }
                } else if (reachingTop <= 0 && !reachingBottom <= 0) {
                    target.style.transform = `translateY(0px)`
                }

                if (reachingBottom <= 0) {
                    target.style.transform = `translateY(${reachingBottom}px)`
                }
            }

            updateParallaxContainerPosition()
            updateParallaxContainer()
        }
    })
}
const __initMaskingAnimation = () => {
    maskingCircle()
    window.removeEventListener('scroll', maskingCircle, true)
    window.addEventListener('scroll', maskingCircle, true)
    document.removeEventListener('obTabChanged', maskingCircle, true)
    document.addEventListener('obTabChanged', maskingCircle, true)

    maskingSquare()
    window.removeEventListener('scroll', maskingSquare, true)
    window.addEventListener('scroll', maskingSquare, true)
    document.removeEventListener('obTabChanged', maskingSquare, true)
    document.addEventListener('obTabChanged', maskingSquare, true)

    animateParallax()
    window.removeEventListener('scroll', animateParallax, true)
    window.addEventListener('scroll', animateParallax, true)
    window.removeEventListener('resize', animateParallax, true)
    window.addEventListener('resize', animateParallax, true)
}

const __initDataScrollAnimateScale = () => {
    const animateScrollItems = document.querySelectorAll('[data-scroll-animate-transform]')

    const updateElementPosition = () => {
        _.forEach(animateScrollItems, (item) => {
            if (isInView(item)) {
                const rect = item.getBoundingClientRect()
                // const nearZeroValue = (rect.top - halfScreen) / 50
                // const nearZeroOffset = nearZeroValue / 2
                const farTop = ((window.innerHeight / 100) * (rect.top + item.offsetHeight)) / 100
                item.classList.add('animate-scroll-init')
                if (farTop > 0) {
                    if (item.dataset.scrollAnimateTransform === 'scale') {
                        // item.style.transform = `scale(${1 - farTop / 100 / 5})`
                    }
                }
            }
        })
    }
    updateElementPosition()
    window.removeEventListener('scroll', () => updateElementPosition(), true)
    window.addEventListener('scroll', () => updateElementPosition(), true)
    document.removeEventListener('obTabChanged', () => updateElementPosition(), true)
    document.addEventListener('obTabChanged', () => updateElementPosition(), true)
}

const __jarallax = () => {
    window.addEventListener('scroll', () => {
        _.forEach(allJal, (item) => {
            const parent = item.parentNode
            const parentRect = parent.getBoundingClientRect()
            item.style.transform = `translateY(${parentRect.top * -1}px)`
        })
    })
}

const __initPageLoad = () => {
    // const allSection = document.querySelectorAll(
    //     '.ob-container.container--left:not(.container--divider):not(.container--article):not(.container--article-news-list):not(.container--article-content-section)'
    // )
    // const firstSection = _.first(allSection)
    // if (firstSection) {
    //     setTimeout(() => {
    //         firstSection.style.opacity = ''
    //         firstSection.style.transition = '1s ease'
    //         firstSection.style.transform = ''
    //     }, 500)
    // }

    // const allSection = document.querySelectorAll('.ob-container:not(.container--divider)')

    document.body.style.opacity = 1
    setTimeout(() => {
        _.forEach(allLoadedSection, (item) => {
            item.style.opacity = ''
            item.style.transition = '1s ease'
            item.style.transform = ''
        })
        const dividerContainer = document.querySelectorAll('.container--divider')
        _.forEach(dividerContainer, (item) => {
            item.style.transition = '1s ease'
            item.style.opacity = 1
        })
        let pageLoaded = new Event('pageLoaded')
        document.dispatchEvent(pageLoaded)
    }, 500)
    setTimeout(() => {
        _.forEach(allLoadedSection, (item) => {
            document.body.setAttribute('data-page-reveal', 'completed')
            item.style.transition = ''
        })
    }, 1500)
}

;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)

            jarallax(document.querySelectorAll('.jarallax'), {
                speed: 0.5,
                disableParallax: /iPad|iPhone|iPod|Android/,
                disableVideo: /iPad|iPhone|iPod|Android/,
            })

            __initDataScrollAnimate()
            __initDataScrollAnimatePosition()
            __initMaskingAnimation()
            __initDataScrollAnimateScale()
            __initPageLoad()

            window.addEventListener('resize', __initMaskingAnimation, true)

            console.log('Animator script imported')
        }
    }, 100)
})()
