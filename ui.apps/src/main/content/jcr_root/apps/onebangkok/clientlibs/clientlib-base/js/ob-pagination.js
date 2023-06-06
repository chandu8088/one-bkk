'use strict'

// import {
//     isMobileView,
//     getChildNodes,
//     normalizePagination,
//     scrollToView,
//     pauseCarouselVideo,
//     percentageInViewport,
//     animateCarouselItemOut,
//     animateCarouselItemIn,
// } from './core.js'

const onPaginationReady = new Event('onPaginationReady')

var windowWidth = window.innerWidth

const generatePaginationLoops = (pagi) => {
    pagi.classList.add('generating-loop')
    const pagiChild = getChildNodes(pagi)

    _.forEach(pagiChild, (item) => {
        if (item.dataset.paginationClone) {
            item.remove()
        }
    })
    const firstPagiChild = _.first(pagiChild)
    // const lastPagiChild = _.last(pagiChild)

    const fragmentLeft1 = document.createDocumentFragment()
    const fragmentLeft2 = document.createDocumentFragment()
    const fragmentRight1 = document.createDocumentFragment()
    const fragmentRight2 = document.createDocumentFragment()
    _.forEach(getChildNodes(pagi), (item) => {
        const child1 = item.cloneNode(true)
        const child2 = item.cloneNode(true)
        child1.setAttribute('data-pagination-clone', 'left')
        child2.setAttribute('data-pagination-clone', 'left')

        if (item.classList.contains('article-thumbnail-group')) {
            _.forEach(getChildNodes(child1), (item) => {
                item.setAttribute('data-aos', 'none')
                item.setAttribute('data-aos', 'none')
            })
            _.forEach(getChildNodes(child2), (item) => {
                item.setAttribute('data-aos', 'none')
                item.setAttribute('data-aos', 'none')
            })
        }
        fragmentLeft1.appendChild(child1)
        fragmentLeft2.appendChild(child2)
    })
    _.forEach(getChildNodes(pagi), (item) => {
        const child1 = item.cloneNode(true)
        const child2 = item.cloneNode(true)
        child1.setAttribute('data-pagination-clone', 'right')
        child2.setAttribute('data-pagination-clone', 'right')
        if (item.classList.contains('article-thumbnail-group')) {
            _.forEach(getChildNodes(child1), (item) => {
                item.setAttribute('data-aos', 'none')
                item.setAttribute('data-aos', 'none')
            })
            _.forEach(getChildNodes(child2), (item) => {
                item.setAttribute('data-aos', 'none')
                item.setAttribute('data-aos', 'none')
            })
        }
        fragmentRight1.appendChild(child1)
        fragmentRight2.appendChild(child2)
    })

    pagi.insertBefore(fragmentLeft1, firstPagiChild)
    pagi.insertBefore(fragmentLeft2, firstPagiChild)
    pagi.insertBefore(fragmentRight1, pagiChild.nextSibling)
    pagi.insertBefore(fragmentRight2, pagiChild.nextSibling)

    // FIRST LANDING
    // const targetRect = firstPagiChild.getBoundingClientRect()

    // const parentRect = firstPagiChild.parentNode.getBoundingClientRect()

    pagi.classList.add('generating-loop')
    if (firstPagiChild) {
        scrollToView(firstPagiChild, { animate: false })
        firstPagiChild.classList.add('active')
    }

    const removeClonedItems = () => {
        if (!pagi.classList.contains('generating-loop')) {
            const clonedItems = pagi.querySelectorAll('[data-pagination-clone]')
            _.forEach(clonedItems, (item) => {
                item.remove()
            })
        }
    }

    const deboucedRemoveItems = _.debounce(
        () => {
            removeClonedItems()
        },
        400,
        { maxWait: 1000 }
    )

    window.addEventListener('resize', () => {
        if (window.innerWidth != windowWidth) {
            // Update the window width for next time
            windowWidth = window.innerWidth

            deboucedRemoveItems.cancel()
            if (isMobileView) {
                deboucedRemoveItems()
            }
        }
    })

    pagi.classList.remove('generating-loop')

    // pagi.scrollBy({ left: targetRect.x - parentRect.x, behavior: 'auto' })
}

const generatePaginationDots = (dotsWrapper, pagiChilds, paginator) => {
    let pagiDotsFragment = document.createDocumentFragment()

    _.forEach(pagiChilds, (item, index) => {
        const dot = document.createElement('div')

        if (index == 0) {
            dot.classList.add('active')
        }
        pagiDotsFragment.appendChild(dot)
    })

    return pagiDotsFragment
}

const __initPagination = (reinit = false) => {
    const ALL_PAGINATOR = document.querySelectorAll('[data-pagination]')

    reinit &&
        _.forEach(ALL_PAGINATOR, (pagi) => {
            let paginator = pagi
            const newPaginator = paginator.cloneNode(true)
            paginator.parentNode.insertBefore(newPaginator, paginator)
            paginator.remove()
        })

    AOS.refresh()

    const ALL_REMAP_PAGINATOR = document.querySelectorAll('[data-pagination]')

    _.forEach(ALL_REMAP_PAGINATOR, (pagi) => {
        let paginator = pagi

        const config = {
            loop: paginator.dataset.paginationConfig?.includes('loop'),
            loopMobile: paginator.dataset.paginationConfig?.includes('loop-mobile'),
            mobileOnly: paginator.dataset.paginationConfig?.includes('mobile-only'),
            hideControl: paginator.dataset.paginationConfig?.includes('hide-control'),
            autoScroll: paginator.dataset.paginationConfig?.includes('auto-scroll'),
        }

        const pagination = paginator.nextElementSibling

        config.mobileOnly && pagination.classList.add('pagination--mobile-only')
        config.hideControl && pagination.classList.add('pagination--hide-control')

        let pagiChilds = []

        if (pagi.dataset.pagination === 'pagination-type-1-carousel') {
            paginator = pagi.querySelector('.carousel-content')
            pagiChilds = getChildNodes(pagi.querySelector('.carousel-content'))
        } else if (pagi.dataset.pagination === 'pagination-type-1-reports') {
            if (isMobileView) {
                pagiChilds = _.filter(getChildNodes(paginator, true), (item) => {
                    return !item.classList.contains('hidden')
                })
            } else {
                return false
            }
        } else {
            pagiChilds = getChildNodes(paginator, true)
        }

        let indexCarouselGroupItemCounter = 0

        _.forEach(pagiChilds, (child, index) => {
            if (index == 0) {
                child.classList.add('active')
            }
            child.setAttribute('data-pagination-index', index)
            if (child.classList.contains('carousel-group')) {
                _.forEach(getChildNodes(child), (item) => {
                    item.setAttribute('data-pagination-index', indexCarouselGroupItemCounter)
                    indexCarouselGroupItemCounter += 1
                })
            }
        })
        const dotsWrapper = pagination?.querySelector('.pagination--dots')
        if (dotsWrapper) {
            _.forEach(getChildNodes(dotsWrapper), (item) => item.remove())
            const dots = generatePaginationDots(dotsWrapper, pagiChilds, paginator)
            dotsWrapper?.appendChild(dots)
            normalizePagination(paginator)
        }

        if (config.loop) {
            if (config.loopMobile && isMobileView) {
                generatePaginationLoops(paginator)
            } else if (!config.loopMobile) {
                generatePaginationLoops(paginator)
            }
        }

        _.forEach(getChildNodes(dotsWrapper), (dot, index) => {
            const backPg = pagination.querySelector('.pagination__back-btn')
            const nextPg = pagination.querySelector('.pagination__next-btn')

            dot.addEventListener('click', () => {
                const currentActiveDot = _.findIndex(getChildNodes(dotsWrapper), (item) => item.classList.contains('active'))

                const isCurrent = currentActiveDot === index

                if (isCurrent) {
                    return false
                }

                pauseCarouselVideo(paginator)

                const isForwarding = currentActiveDot < index
                const orgChild = getChildNodes(paginator, true)

                const currentActiveItem = _.findIndex(orgChild, (item) => item.classList.contains('active'))
                const childRange = isForwarding ? _.slice(orgChild, currentActiveItem, orgChild.length) : _.slice(orgChild, 0, currentActiveItem)

                let childs = []

                if (window.innerWidth >= 841 && pagi.classList.contains('carousel-content-wrapper')) {
                    childs = orgChild
                } else {
                    childs = _.filter(childRange, (item) => {
                        return item.dataset.paginationIndex === index.toString()
                    })
                }
                let percentageInView = []
                _.forEach(childs, (item, index) => {
                    animateCarouselItemOut(item)
                    // item.classList.remove('active')
                    const result = percentageInViewport(item)
                    percentageInView.push(result)
                })

                const mvp = _.max(percentageInView)

                const targetIndex = _.findIndex(percentageInView, (item) => item === mvp)

                if (window.innerWidth >= 841 && pagi.classList.contains('carousel-content-wrapper')) {
                    animateCarouselItemIn(childs[index], paginator)
                    // childs[index].classList.add('active')
                } else {
                    childs[targetIndex]?.classList.add('active')
                    scrollToView(childs[targetIndex])
                }

                if (!config.loop && childs[targetIndex].dataset.paginationIndex === (orgChild.length - 1).toString()) {
                    nextPg.classList.add('disabled')
                } else {
                    nextPg.classList.remove('disabled')
                }

                if (!config.loop && childs[targetIndex].dataset.paginationIndex == 0) {
                    backPg.classList.add('disabled')
                } else {
                    backPg.classList.remove('disabled')
                }
                let currentActiveDotIndex = null
                _.forEach(getChildNodes(dotsWrapper), (item, dotIndex) => {
                    if (item.classList.contains('active')) {
                        currentActiveDotIndex = dotIndex
                    }
                    if (index === dotIndex) {
                        item.classList.add('active')
                    } else {
                        item.classList.remove('active')
                    }
                })

                normalizePagination(currentActiveDotIndex, targetIndex)

                if (paginator.classList.contains('article-thumbnail')) {
                    debouncedPagiScroll()
                }
            })
        })

        const debouncedRemapLoop = _.debounce(() => {
            if (!config.loop) {
                return false
            }
            const pagiChilds = getChildNodes(paginator, true)
            const pagiChildSize = _.size(pagiChilds)

            const isOnLeft = _.findIndex(pagiChilds, (item) => item.classList.contains('active')) + 1 <= (pagiChildSize / 5) * 2

            const isOnRight = _.findIndex(pagiChilds, (item) => item.classList.contains('active')) + 1 >= (pagiChildSize / 5) * 3 + 1

            if (isOnLeft) {
                const fragment = document.createDocumentFragment()

                _.forEach(_.slice(pagiChilds, (pagiChildSize / 5) * 4), (item) => {
                    fragment.appendChild(item)
                })

                paginator.insertBefore(fragment, _.first(pagiChilds))
            } else if (isOnRight) {
                const fragment = document.createDocumentFragment()

                _.forEach(_.slice(pagiChilds, 0, pagiChildSize / 5), (item) => {
                    fragment.appendChild(item)
                })

                paginator.insertBefore(fragment, pagiChilds.nextSibling)
            }

            if (isOnLeft || isOnRight) {
                const currentActive = _.find(pagiChilds, (item) => item.classList.contains('active'))

                // console.log('scroll to active')
                paginator.classList.add('generating-loop')
                scrollToView(currentActive, { animate: false })
                paginator.classList.remove('generating-loop')
            }
        }, 100)

        const debouncedPagiScroll = _.debounce(() => {
            if (paginator.classList.contains('generating-loop')) {
                return
            }

            const childs = getChildNodes(paginator, true)
            let percentageInView = []
            _.forEach(childs, (item, index) => {
                // item.classList.remove('active')
                if (paginator.classList.contains('carousel')) {
                    const paginationCenter = paginator.parentNode.querySelector('.pagination')
                    const paginationCenterRect = paginationCenter.getBoundingClientRect()
                    const paginationCenterRectPos = paginationCenterRect.left + paginationCenterRect.width / 2

                    const itemRect = item.getBoundingClientRect()
                    if (itemRect.x + itemRect.width + 25 > paginationCenterRectPos && itemRect.x < paginationCenterRectPos) {
                        const result = 100
                        percentageInView.push(result)
                    } else {
                        percentageInView.push(0)
                    }
                } else {
                    const result = percentageInViewport(item)
                    percentageInView.push(result)
                }
            })

            const mvp = _.max(percentageInView)

            const targetIndex = _.findIndex(percentageInView, (item) => item === mvp)

            const pagiChilds = getChildNodes(paginator, true)

            // const targetRect = pagiChilds[targetIndex].getBoundingClientRect()

            _.forEach(childs, (item, index) => {
                index !== targetIndex && item.classList.remove('active')
            })

            if (!pagiChilds[targetIndex].classList.contains('active')) {
                pagiChilds[targetIndex].classList.add('active')
                pauseCarouselVideo(paginator)
            }

            pagiChilds[targetIndex].classList.add('active')

            scrollToView(pagiChilds[targetIndex])
            const nextBtn = pagination.querySelector('.pagination__next-btn')
            const prevBtn = pagination.querySelector('.pagination__back-btn')

            if (!config.loop && targetIndex === pagiChilds.length - 1) {
                nextBtn?.classList.add('disabled')
            } else {
                nextBtn?.classList.remove('disabled')
            }
            if (!config.loop && targetIndex == 0) {
                prevBtn?.classList.add('disabled')
            } else {
                prevBtn?.classList.remove('disabled')
            }

            paginator.classList.add('block-scroll-event-by-remapped')
            debouncedRemapLoop(paginator)

            _.forEach(getChildNodes(dotsWrapper), (item, index) => {
                if (index.toString() === pagiChilds[targetIndex].dataset.paginationIndex) {
                    item.classList.add('active')
                } else {
                    item.classList.remove('active')
                }
            })

            if (paginator.classList.contains('article-thumbnail-list-wrapper')) {
                paginator.parentNode.parentNode.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
            }
        }, 100)

        let autoScrollInit = false
        let autoScrollInterval

        const startScroll = () => {
            clearInterval(autoScrollInterval)
            autoScrollInterval = setInterval(() => {
                const pagiChilds = getChildNodes(paginator, true)
                if (paginator.classList.contains('autoscroll-blocked') || paginator.classList.contains('user-touchstart')) {
                    return false
                }
                const currentActive = _.findIndex(pagiChilds, (item) => item.classList.contains('active'))

                _.forEach(pagiChilds, (item, index) => {
                    if (index === currentActive + 1) {
                        item.classList.add('active')

                        scrollToView(pagiChilds[currentActive + 1])

                        // paginator.scrollBy({ left: targetRect.x, behavior: 'smooth' })
                    } else {
                        item.classList.remove('active')
                    }
                })
            }, 4000 / 2)
        }

        const debouncedPaginationAutoScroll = _.debounce(() => {
            // console.log('debouncedPaginationAutoScroll')
            startScroll()
        }, 4000 / 2)

        dotsWrapper &&
            dotsWrapper.addEventListener('click', () => {
                if (config.autoScroll && autoScrollInit) {
                    clearInterval(autoScrollInterval)
                    debouncedPaginationAutoScroll()
                }
            })

        if (config.autoScroll) {
            if (config.mobileOnly) {
                if (isMobileView) {
                    debouncedPaginationAutoScroll()
                }
            } else {
                debouncedPaginationAutoScroll()
            }
        }

        const backPg = pagination?.querySelector('.pagination__back-btn')
        const nextPg = pagination?.querySelector('.pagination__next-btn')

        if (!config.loop) {
            backPg?.classList.add('disabled')
        }

        const shouldExcludeHidden = !paginator.classList.contains('article-thumbnail')

        backPg?.addEventListener('click', () => {
            const currentActiveItem = _.findIndex(getChildNodes(paginator, true), (item) => item.classList.contains('active'))

            if (currentActiveItem === -1) {
                return
            }

            debouncedPagiScroll.cancel()

            if (config.autoScroll && autoScrollInit) {
                clearInterval(autoScrollInterval)
                debouncedPaginationAutoScroll()
            }

            scrollToView(getChildNodes(paginator, true)[currentActiveItem - 1])

            if (!config.loop && _.findIndex(getChildNodes(paginator, shouldExcludeHidden), (item) => item.classList.contains('active')) == 0) {
                backPg.classList.add('disabled')
            } else {
                backPg.classList.remove('disabled')
            }
            if (paginator.classList.contains('article-thumbnail')) {
                debouncedPagiScroll()
            }
        })

        nextPg?.addEventListener('click', () => {
            const currentActiveItem = _.findIndex(getChildNodes(paginator, true), (item) => item.classList.contains('active'))

            if (currentActiveItem === -1) {
                return
            }

            debouncedPagiScroll.cancel()
            if (config.autoScroll && autoScrollInit) {
                clearInterval(autoScrollInterval)
                debouncedPaginationAutoScroll()
            }

            scrollToView(currentActiveItem !== -1 ? getChildNodes(paginator, true)[currentActiveItem + 1] : getChildNodes(paginator, true)[1])

            if (
                !config.loop &&
                _.findIndex(getChildNodes(paginator, shouldExcludeHidden), (item) => item.classList.contains('active')) ===
                    getChildNodes(paginator, true).length - 1
            ) {
                nextPg.classList.add('disabled')
            }
            backPg.classList.remove('disabled')

            if (paginator.classList.contains('article-thumbnail')) {
                debouncedPagiScroll()
            }
        })

        const handlePaginatorScroll = () => {
            const isRemapped = paginator.classList.contains('block-scroll-event-by-remapped')
            if (isRemapped) {
                paginator.classList.remove('block-scroll-event-by-remapped')
            } else {
                if (config.autoScroll && autoScrollInit) {
                    clearInterval(autoScrollInterval)
                    debouncedPaginationAutoScroll()
                }
                autoScrollInit = config.autoScroll && true

                const childs = getChildNodes(paginator, true)
                let percentageInView = []
                _.forEach(childs, (item, index) => {
                    // item.classList.remove('active')
                    if (paginator.classList.contains('carousel')) {
                        const paginationCenter = paginator.parentNode.querySelector('.pagination')
                        const paginationCenterRect = paginationCenter.getBoundingClientRect()
                        const paginationCenterRectPos = paginationCenterRect.left + paginationCenterRect.width / 2

                        const itemRect = item.getBoundingClientRect()
                        if (itemRect.x + itemRect.width + 25 > paginationCenterRectPos && itemRect.x < paginationCenterRectPos) {
                            const result = 100
                            percentageInView.push(result)
                        } else {
                            percentageInView.push(0)
                        }
                    } else {
                        const result = percentageInViewport(item)
                        percentageInView.push(result)
                    }
                })
                const mvp = _.max(percentageInView)

                const targetIndex = _.findIndex(percentageInView, (item) => item === mvp)

                const pagiChilds = getChildNodes(paginator, true)

                // const targetRect = pagiChilds[targetIndex].getBoundingClientRect()

                _.forEach(childs, (item, index) => {
                    index !== targetIndex && item.classList.remove('active')
                })

                // if (!pagiChilds[targetIndex].classList.contains('active')) {
                //     pagiChilds[targetIndex].classList.add('active')
                //     pauseCarouselVideo(paginator)
                // }

                if (pagi.dataset.pagination !== 'pagination-type-1-carousel') {
                    debouncedRemapLoop.cancel()
                    debouncedPagiScroll()
                } else {
                    if (pagi.classList.contains('pagination-blocked')) {
                        pagi.classList.remove('pagination-blocked')
                    } else {
                        debouncedRemapLoop.cancel()
                        debouncedPagiScroll()
                    }
                }
            }
        }

        paginator.addEventListener('scroll', handlePaginatorScroll)

        const handlePaginationTouchStart = () => {
            config.autoScroll && clearInterval(autoScrollInterval)
            debouncedPagiScroll.cancel()
            pagi.classList.add('user-touchstart')
        }

        const handlePaginationTouchEnd = () => {
            pagi.classList.remove('user-touchstart')
        }

        if (isMobileView) {
            paginator.addEventListener('touchstart', handlePaginationTouchStart)
            paginator.addEventListener('touchend', handlePaginationTouchEnd)
        }

        pagination?.classList.add('ready')
    })
}

const __initPaginationGroupForMobile = () => {
    if (isMobileView) {
        const ALL_PAGINATOR = document.querySelectorAll('[data-pagination]')
        _.forEach(ALL_PAGINATOR, (pagi) => {
            if (pagi.classList.contains('article-thumbnail-group-wrapper') || pagi.classList.contains('article-thumbnail-list-wrapper')) {
                _.forEach(getChildNodes(pagi), (group) => {
                    _.forEach(getChildNodes(group), (item) => {
                        pagi.appendChild(item)
                    })
                    group.remove()
                })
            }
            if (pagi.classList.contains('carousel')) {
                _.forEach(getChildNodes(pagi), (carl, index) => {
                    if (carl.classList.contains('carousel-group')) {
                        _.forEach(getChildNodes(carl), (carlItem, index) => {
                            pagi.appendChild(carlItem)
                        })
                        carl.remove()
                    }
                })
            }
        })
    }
}

const __initPaginationReducer = () => {
    const paginationDots = document.querySelectorAll('.pagination--dots')

    _.forEach(paginationDots, (group) => {
        const shouldHidePagination = _.size(getChildNodes(group)) <= 1

        if (shouldHidePagination) {
            group.parentNode.style.display = 'none'
        } else {
            group.parentNode.style.display = 'flex'
            if (isMobileView) {
                if (group.parentNode.classList.contains('pagination--mobile-only')) {
                    group.parentNode.style.display = 'flex'
                } else if (group.parentNode.classList.contains('pagination-desktop')) {
                    group.parentNode.style.display = 'none'
                }
            } else {
                if (group.parentNode.classList.contains('pagination-desktop')) {
                    group.parentNode.style.display = 'flex'
                } else if (group.parentNode.classList.contains('pagination--mobile-only')) {
                    group.parentNode.style.display = 'none'
                }
            }
            const shouldHideDots = _.size(getChildNodes(group)) > 5
            const prevBtn = group.parentNode.querySelector('.pagination__back-btn')
            const nextBtn = group.parentNode.querySelector('.pagination__next-btn')

            if (shouldHideDots) {
                group.style.display = 'none'
                if (isMobileView) {
                    prevBtn.style.setProperty('display', 'block', 'important')
                    nextBtn.style.setProperty('display', 'block', 'important')
                } else {
                    prevBtn.style.display = 'block'
                    prevBtn.style.margin = '0 24px'
                    nextBtn.style.display = 'block'
                    nextBtn.style.margin = '0 24px'
                }
            }
        }
    })
}

;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)

            document.addEventListener('requestUpdatePagination', () => {
                // __initPagination(true)
                __initPaginationReducer()
                document.dispatchEvent(onPaginationReady)
            })

            window.addEventListener('resize', () => {
                __initPaginationReducer()
            })

            console.log('Pagination script imported')
        }
    }, 100)
})()
