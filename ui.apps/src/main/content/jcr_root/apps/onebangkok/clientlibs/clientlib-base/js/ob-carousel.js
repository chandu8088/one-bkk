'use strict'

// import {
//     isMobileView,
//     getChildNodes,
//     htmlToElement,
//     scrollToView,
//     normalizePagination,
//     disableScroll,
//     enableScroll,
//     animateCarouselItemOut,
//     animateCarouselItemIn,
//     pauseCarouselVideo,
// } from './core.js'

// import { __initPagination, __initPaginationGroupForMobile, __initPaginationReducer } from './ob-pagination.js'

const __initCarousel = () => {
    const carl = document.querySelectorAll('[data-carousel]')
    _.forEach(carl, (carlGroup) => {
        const carlGallery = document.querySelector(`[data-carousel-id=${carlGroup.dataset.carousel}]`)
        const carlGalleryBackdrop = carlGallery.querySelector('.carousel-gallery__wrapper-backdrop')

        const carlGalleryWrapper = carlGallery.querySelector('.carousel-content-wrapper')

        carlGalleryWrapper.classList.add('pagination-blocked')

        carlGroup.addEventListener('click', () => {
            carlGallery.querySelector('.carousel-content-wrapper').classList.add('pagination-blocked')
            carlGroup.classList.add('autoscroll-blocked')
            carlGallery.classList.add('active')
            disableScroll()
            carlGalleryBackdrop && carlGalleryBackdrop.classList.add('active')
        })

        carlGalleryBackdrop.addEventListener('click', () => {
            carlGallery.classList.remove('active')
            enableScroll()
            carlGroup.classList.remove('autoscroll-blocked')
            carlGalleryBackdrop && carlGalleryBackdrop.classList.remove('active')
            pauseCarouselVideo(carlGroup)
        })

        const carlCloseBtn = carlGallery.querySelectorAll('[data-carousel-close-btn]')
        _.forEach(carlCloseBtn, (item) => {
            item.addEventListener('click', () => {
                pauseCarouselVideo(carlGroup)
                enableScroll()
                carlGroup.classList.remove('autoscroll-blocked')
                carlGallery.classList.remove('active')
                carlGalleryBackdrop && carlGalleryBackdrop.classList.remove('active')
            })
        })

        const carlGalleryContentWrapper = carlGallery.querySelector('.carousel-content')
        const childNodes = isMobileView ? getChildNodes(carlGroup) : _.filter(getChildNodes(carlGroup), (item) => !item.dataset.paginationClone)

        const popItemToGallery = (child, fromCarouselGroup = false) => {
            if (child.dataset.carouselObject) {
                const newNode = htmlToElement(`<div class="carousel__iframe-wrapper">${child.dataset.carouselObject}</div>`)
                newNode.setAttribute('data-carousel-object', 'true')
                newNode.setAttribute('playsinline', 'true')
                const haveLabel = newNode.querySelector('.carousel__label')
                if (!haveLabel) {
                    newNode.appendChild(htmlToElement('<div class="carousel__label"></div>'))
                }
                carlGalleryContentWrapper.append(newNode)
            } else {
                const newNode = child.cloneNode(true)
                if (fromCarouselGroup) {
                    newNode.classList.add('carousel-group-pop-item')
                }
                carlGalleryContentWrapper.append(newNode)
            }
        }
        _.forEach(childNodes, (child, index) => {
            if (child.classList.contains('carousel-group')) {
                _.forEach(getChildNodes(child), (item) => {
                    popItemToGallery(item, true)
                })
            } else if (child.tagName == 'DIV') {
                popItemToGallery(child, true)
            } else {
                popItemToGallery(child)
            }

            const escapeHtml = (text) => {
                var map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;',
                }

                return text.replace(/[&<>"']/g, function (m) {
                    return map[m]
                })
            }

            if (child.dataset.carouselObject) {
                const newEl = document.createElement('div')

                newEl.setAttribute('data-carousel-object', 'true')
                const newChild = child.cloneNode(true)

                newEl.appendChild(newChild)
                newEl.classList.add('carousel-item--video')

                const parent = child.parentNode
                parent.insertBefore(newEl, child)
                child.remove()
            }
        })

        const nextBtn = carlGallery.querySelector('.carousel-content-control-next')
        const prevBtn = carlGallery.querySelector('.carousel-content-control-prev')

        nextBtn.addEventListener('click', () => {
            const carouselContentItems = getChildNodes(carlGalleryContentWrapper)
            const currentActive = _.findIndex(carouselContentItems, (item) => item.classList.contains('active'))
            _.forEach(carouselContentItems, (item, index) => {
                if (currentActive !== _.size(carouselContentItems) - 1) {
                    if (index === currentActive + 1 && item) {
                        animateCarouselItemIn(item, carlGalleryContentWrapper)
                    } else if (index === currentActive) {
                        animateCarouselItemOut(item)
                    } else {
                        item.classList.remove('active')
                    }
                } else {
                    if (index == 0) {
                        animateCarouselItemIn(item, carlGalleryContentWrapper)
                    } else if (index === currentActive) {
                        animateCarouselItemOut(item)
                    } else {
                        item.classList.remove('active')
                    }
                }
            })
            pauseCarouselVideo(carlGalleryContentWrapper)
        })

        prevBtn.addEventListener('click', () => {
            const carouselContentItems = getChildNodes(carlGalleryContentWrapper)
            const currentActive = _.findIndex(carouselContentItems, (item) => item.classList.contains('active'))
            _.forEach(carouselContentItems, (item, index) => {
                if (currentActive !== 0) {
                    if (index === currentActive - 1 && item) {
                        animateCarouselItemIn(item, carlGalleryContentWrapper)
                    } else if (index === currentActive) {
                        animateCarouselItemOut(item)
                    } else {
                        item.classList.remove('active')
                    }
                } else {
                    if (index === _.size(carouselContentItems) - 1) {
                        animateCarouselItemIn(item, carlGalleryContentWrapper)
                    } else if (index === currentActive) {
                        animateCarouselItemOut(item)
                    } else {
                        item.classList.remove('active')
                    }
                }
            })
            pauseCarouselVideo(carlGalleryContentWrapper)
        })
    })
}

const __initCarouselOnClick = () => {
    const carl = document.querySelectorAll('[data-carousel]')
    _.forEach(carl, (carlGroup) => {
        const carlGallery = document.querySelector(`[data-carousel-id=${carlGroup.dataset.carousel}]`)

        const carlGalleryContentWrapper = carlGallery.querySelector('.carousel-content')
        const childNodes = getChildNodes(carlGroup)

        const addEventListenerCarlItem = (item, index) => {
            item.addEventListener('click', () => {
                const carouselContentItems = _.filter(getChildNodes(carlGalleryContentWrapper), (item) => !item.dataset.paginationClone)

                _.forEach(carouselContentItems, (carl) => {
                    if (carl.classList.contains('carousel-group')) {
                    } else {
                        if (carl.dataset.paginationIndex === item.dataset.paginationIndex) {
                            carl.classList.add('active')
                            // const targetRect = carl.getBoundingClientRect()
                            scrollToView(carl, { animate: false })
                            // carl.parentNode.scrollBy({ left: targetRect.x - 16, behavior: 'auto' })

                            const pagination = carlGalleryContentWrapper.parentNode.nextElementSibling.querySelector('.pagination--dots')

                            let currentActiveDot = null

                            _.forEach(getChildNodes(pagination), (dot, dotIndex) => {
                                if (dot.classList.contains('active')) {
                                    currentActiveDot, dotIndex
                                }
                                if (dotIndex.toString() === carl.dataset.paginationIndex) {
                                    dot.classList.add('active')
                                } else {
                                    dot.classList.remove('active')
                                }
                            })

                            normalizePagination(currentActiveDot, carl.dataset.paginationIndex)
                        } else {
                            carl.classList.remove('active')
                        }
                    }
                })
            })
        }

        _.forEach(childNodes, (item, index) => {
            if (item.classList.contains('carousel-group')) {
                _.forEach(getChildNodes(item), (subItem, subItemIndex) => {
                    addEventListenerCarlItem(subItem, subItemIndex)
                })
            } else {
                addEventListenerCarlItem(item, index)
            }
        })
    })
}

const __initCarouselImageContentObserver = () => {
    const carouselImgContents = document.querySelectorAll('.modal--carousel-image-content')

    _.forEach(carouselImgContents, (carousel) => {
        const imageToObseve = carousel.querySelector('.carousel-image-content')
        const paginationDotsToObserve = imageToObseve?.querySelector('.pagination--dots')
        const contentWrapper = carousel.querySelector('.carousel-image-content-container')

        if (imageToObseve && imageToObseve.parentNode) {
            imageToObseve.parentNode.classList.add('modal--carousel-image-content__fixed-scroll')
        }

        const debouceUpdateContent = _.debounce(() => {
            const activeDotIndex = _.findIndex(getChildNodes(paginationDotsToObserve), (item) => item.classList.contains('active'))

            const activeContentIndex = _.findIndex(getChildNodes(contentWrapper), (item) => item.classList.contains('active'))

            if (activeDotIndex !== activeContentIndex) {
                _.forEach(getChildNodes(contentWrapper), (item, index) => {
                    if (index !== activeDotIndex) {
                        item.classList.remove('active')
                    } else {
                        item.classList.add('active')
                    }
                })
            }
        }, 100)

        const attrObserver = new MutationObserver((mutations) => {
            mutations.forEach((mu) => {
                if (mu.type !== 'attributes' && mu.attributeName !== 'class') return
                debouceUpdateContent()
            })
        })

        _.forEach(getChildNodes(paginationDotsToObserve), (dot) => {
            attrObserver.observe(dot, { attributes: true })
        })
    })
}

const __initCarouselImageContentMobile = (mobile) => {
    const modals = document.querySelectorAll('.modal--carousel-image-content')
    _.forEach(modals, (modal) => {
        const contentWrapper = modal.querySelector('.modal__content')
        const contents = getChildNodes(contentWrapper)
        const paginator = modal.querySelector('.carousel-image-content__images')

        _.forEach(getChildNodes(paginator, true), (page, pageIndex) => {
            _.forEach(getChildNodes(page), (item) => {
                const target = item.querySelector('.carousel-image-content__content-wrapper')

                target?.remove()
            })
        })
        _.forEach(getChildNodes(paginator, true), (page, pageIndex) => {
            const cloned = contents[pageIndex]?.cloneNode(true)

            if (cloned) {
                cloned?.classList.add('carousel-image-content__content-wrapper')
                page.appendChild(cloned)
            }
        })

        window.addEventListener('resize', () => {
            let requestUpdatePagination = new Event('requestUpdatePagination')
            document.dispatchEvent(requestUpdatePagination)
        })
    })
}

const initCarouselImageContentMobile = () => {
    __initCarouselImageContentMobile()
}

;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)

            initCarouselImageContentMobile()

            __initCarousel()
            __initPaginationGroupForMobile()
            __initPagination()

            __initCarouselOnClick()
            __initCarouselImageContentObserver()

            __initPaginationReducer()

            console.log('Carousel script imported')
        }
    }, 100)
})()
