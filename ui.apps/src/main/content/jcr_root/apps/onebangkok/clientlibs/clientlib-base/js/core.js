'use strict'

const objectCountRef = { current: 0 }

let isMobileView = window.innerWidth < 841

window.addEventListener('resize', () => {
    isMobileView = window.innerWidth < 841
})

const allLoadedSectionUnfilter = document.querySelectorAll(
    '.ob-container:not(.container--divider)' +
        ':not(.tab-content *)' +
        ':not(.container--parallax *)' +
        ',.content.article__wrapper' +
        ',.full-screen-banner' +
        ',.site-history' +
        ',.container--background-fullwidth'

    // ':not(.container--article)' +
    // ':not(.container--article-news-list)' +
    // ':not(.container--article-content-section)' +
)

const allLoadedSection = _.chain(allLoadedSectionUnfilter)
    .map((item) => {
        const containUnwantedComponent = item.querySelector('.container--masonry-scroll, .image-layout-title__text')
        if (!!containUnwantedComponent) {
            return false
        } else {
            return item
        }
    })
    .compact()
    .value()

const getChildNodes = (node, excludeHidden) => {
    return _.filter(node?.childNodes, (item) => {
        if (excludeHidden) {
            return item.nodeType === Node.ELEMENT_NODE && !item.classList.contains('hidden')
        } else {
            return item.nodeType === Node.ELEMENT_NODE
        }
    })
}

const useState = (defaultValue) => {
    let value = defaultValue
    const setValue = (newValue) => (value = newValue)
    return [value, setValue]
}

const htmlToElement = (htmlString) => {
    var template = document.createElement('template')
    htmlString = htmlString.trim()
    template.innerHTML = htmlString
    return template.content.firstChild
}

const normalizePagination = (before = null, after = null) => {
    let isGoingForward = true
    if (before !== null && after !== null && before !== after) {
        isGoingForward = before < after
    }
    const paginationDots = document.querySelectorAll('.pagination--dots')
    _.forEach(paginationDots, (pagiDots) => {
        const dots = getChildNodes(pagiDots)
        const dotsSize = _.size(dots)

        const currentActiveDotIndex = _.findIndex(dots, (item) => item.classList.contains('active'))

        const range = {
            forward: {
                start:
                    currentActiveDotIndex === dotsSize - 1
                        ? currentActiveDotIndex - 4
                        : currentActiveDotIndex - 3 < 0
                        ? 0
                        : currentActiveDotIndex - 3,
                end: currentActiveDotIndex + 1 < 4 ? 4 : currentActiveDotIndex + 1,
            },
            backward: {
                start:
                    currentActiveDotIndex === dotsSize - 1
                        ? currentActiveDotIndex - 4
                        : currentActiveDotIndex - 3 < 0
                        ? 0
                        : currentActiveDotIndex - 3,
                end: currentActiveDotIndex + 1 < 4 ? 4 : currentActiveDotIndex + 1,
            },
        }

        const startIndex = isGoingForward ? range.forward.start : range.backward.start
        const endIndex = isGoingForward ? range.forward.end : range.backward.end

        const remapDots = () => {
            _.forEach(dots, (item, index) => {
                if (index >= startIndex && index <= endIndex) {
                    item.classList.add('shown')
                } else {
                    item.classList.add('shown')
                    // item.classList.add('hidden')
                }
            })
        }

        remapDots()
    })
}

const isInView = (el, horizontalOnly = false) => {
    const rect = el.getBoundingClientRect()
    if (horizontalOnly) {
        return rect.right >= 0 && rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    }
    return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

const getCounterText = (start, end, all) => {
    if (all == 0) {
        return ''
    } else if (!all) {
        return `SHOWING ${start} OF ${end}`
    } else if (all < end) {
        return `SHOWING ${all} OF ${all}`
    } else if (start == 1 && end == all) {
        return `SHOWING ${end} OF ${all}`
    } else if (start == all) {
        return `SHOWING ${start} OF ${all}`
    } else {
        return `SHOWING ${start}-${end} OF ${all}`
    }
}

const scrollToView = (el, options = { animate: true }) => {
    let forceNoAnimate = false

    if (!el) {
        return
    }

    if (el.classList.contains('article-thumbnail--list')) {
        forceNoAnimate = true
    }

    const { animate } = options
    const targetEl = el.getBoundingClientRect()
    const parentEl = el.parentNode.getBoundingClientRect()

    let offset = 0
    if (el.parentNode.classList.contains('carousel-content')) {
        offset = 0
    }
    if (el.parentNode.classList.contains('carousel') && !el.parentNode.parentNode.classList.contains('carousel-grid')) {
        if (window.innerWidth > 786) {
            const paginationPosition = el.parentNode.parentNode.querySelector('.pagination')

            const paginationRect = paginationPosition.getBoundingClientRect()
            const posPagi = paginationRect.width / 2 + paginationRect.left

            const value = posPagi - targetEl.width / 2

            offset = value * -1
        } else {
            offset = 0
        }
    }

    if (
        window.innerWidth <= 841 &&
        (el?.parentNode?.parentNode?.classList.contains('carousel-grid') || el?.parentNode?.classList?.contains('img-grid'))
    ) {
        offset = -22
    }

    el.parentNode.scrollBy({ left: targetEl.x - parentEl.left + offset, behavior: !forceNoAnimate ? (animate ? 'smooth' : 'auto') : 'auto' })
    if (el.classList.contains('article-thumbnail--list')) {
        let percentageInView = []
        const childGroup = getChildNodes(el.parentNode)
        _.forEach(childGroup, (item) => {
            const result = percentageInViewport(item)
            percentageInView.push(result)
            item.classList.remove('active')
        })

        const mvp = _.max(percentageInView)

        const targetIndex = _.findIndex(percentageInView, (item) => item === mvp)

        childGroup[targetIndex].classList.add('active')
    }
}

const pauseCarouselVideo = (callerEl) => {
    if (!callerEl) {
        return
    }

    let targetEl = callerEl
    if (callerEl.dataset.carousel) {
        targetEl = document.querySelector(`[data-carousel-id=${callerEl.dataset.carousel}]`)
    }
    const iframes = targetEl.querySelectorAll('.carousel__iframe-wrapper > iframe,.carousel__iframe-wrapper > video')

    _.forEach(iframes, (frame) => {
        const iframeCloned = frame.cloneNode(true)
        const parentNode = frame.parentNode

        parentNode?.insertBefore(iframeCloned, frame)
        frame.remove()
    })
}

const percentageInViewport = (element) => {
    const parentEl = element.parentNode

    const parentElRect = parentEl.getBoundingClientRect()
    const elRect = element.getBoundingClientRect()

    const overLeftE = elRect.x - parentElRect.x
    const overLeft = overLeftE / (elRect.width / 100) < 0 ? overLeftE / (elRect.width / 100) : 0

    const overRightE = (elRect.right - parentElRect.right) * -1
    const overRight = overRightE / (elRect.width / 100) < 0 ? overRightE / (elRect.width / 100) : 0

    return 100 + overLeft + overRight
}

const animateCarouselItemIn = (carItem, carContentWrapper) => {
    setTimeout(() => {
        carItem.classList.add('animate-in')
        setTimeout(() => {
            const pagination = carContentWrapper.parentNode.nextElementSibling.querySelector('.pagination--dots')

            let currentActiveDot = null
            _.forEach(getChildNodes(pagination), (dot, dotIndex) => {
                if (dot.classList.contains('active')) {
                    currentActiveDot = dotIndex
                }
                if (dotIndex.toString() === carItem.dataset.paginationIndex) {
                    dot.classList.add('active')
                } else {
                    dot.classList.remove('active')
                }
                normalizePagination(currentActiveDot, carItem.dataset.paginationIndex)
            })
            carItem.classList.add('active')
            carItem.classList.remove('animate-in')
        }, 250)
    }, 250)
}

const animateCarouselItemOut = (carItem) => {
    carItem.classList.add('animate-out')
    setTimeout(() => {
        if (carItem.classList.contains('article-thumbnail--list')) {
            carItem.classList.remove('animate-out')
        } else {
            carItem.classList.remove('active')
            carItem.classList.remove('animate-out')
        }
    }, 250)
}

const openModalCarousel = (modalId) => {
    const carlGallery = document.querySelector(`[data-carousel-id=${modalId}]`)
    const carlGalleryBackdrop = carlGallery.querySelector('.carousel-gallery__wrapper-backdrop')

    if (carlGallery) {
        carlGallery.classList.add('active')
        carlGalleryBackdrop && carlGalleryBackdrop.classList.add('active')
        disableScroll()
    } else {
        console.log('modal not found')
    }
}

const closeModal = (modalId) => {
    const modal = document.querySelector(`[data-modal-id=${modalId}]`)

    if (!!modalId) {
        if (modal) {
            const wrapper = modal.parentNode
            wrapper.classList.remove('active')
            enableScroll()
        } else {
            console.warn('modal not found')
        }
    } else {
        const allModal = document.querySelectorAll(`[data-modal-id]`)

        _.forEach(allModal, (item) => {
            item.parentNode?.classList.remove('active')
        })
        enableScroll()
    }
}

// call this to Disable
const disableScroll = () => {
    if (!document.body.classList.contains('disabled-scroll')) {
        // trigger the init process when there is no other popup exist
        document.body.style.top = `-${window.scrollY}px`
        document.body.style.position = 'fixed'
        document.body.classList.add('disabled-scroll')
        // document.body.classList.add('disabled-aos')
    }
}

// call this to Enable
const enableScroll = () => {
    setTimeout(() => {
        if (document.body.classList.contains('disabled-scroll')) {
            // trigger the reset process when all the popup are closed
            const scrollY = document.body.style.top
            document.body.style.position = ''
            document.body.style.top = ''
            window.scrollTo({ left: 0, top: parseInt(scrollY || '0') * -1, behavior: 'auto' })
            document.body.classList.remove('disabled-scroll')
            // document.body.classList.remove('disabled-aos')
        }
    }, 500)
}
