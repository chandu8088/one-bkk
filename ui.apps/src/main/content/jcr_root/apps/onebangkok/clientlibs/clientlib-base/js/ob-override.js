'use strict'

const addDataAOS = (elsArray, data, delay) => {
    _.forEach(elsArray, (item) => {
        if (item) {
            item?.setAttribute('data-aos', data)
            if (delay) {
                item?.setAttribute('data-aos-delay', delay)
            }
        }
    })
}

const removeDataAOS = (elsArray) => {
    _.forEach(elsArray, (item) => {
        if (item) {
            item?.removeAttribute('data-aos')
            item?.removeAttribute('data-aos-delay')
        }
    })
}

const removeTransform = (els) => {
    _.forEach(els, (item) => {
        item.parentNode.classList.add('no-transform')
    })
}

const override = () => {
    const team = document.querySelector('.team-wrapper')
    if (team) {
        team.parentNode.style.paddingTop = 0
    }
    const twoImageMedia = document.querySelectorAll('.two-image-media')
    const circleButtonWrappers = document.querySelectorAll('.circle-button-wrapper')

    removeTransform(twoImageMedia)
    removeTransform(circleButtonWrappers)

    _.forEach(circleButtonWrappers, (wrapper) => {
        if (isMobileView) {
            wrapper.setAttribute('data-scroll-animate', '2')
        } else {
            wrapper.setAttribute('data-scroll-animate', '4')
        }
    })

    const circleImageMedia = document.querySelectorAll('.content__media.content__media--overflow')
    _.forEach(circleImageMedia, (wrapper) => {
        if (isMobileView) {
            wrapper.setAttribute('data-scroll-animate', '2')
        } else {
            wrapper.setAttribute('data-scroll-animate', '4')
        }
    })

    const circleImageMediaOverflow = document.querySelectorAll('.content__media.content__media-mb-fit')
    _.forEach(circleImageMediaOverflow, (wrapper) => {
        if (isMobileView) {
            wrapper.setAttribute('data-scroll-animate', '2')
        } else {
            wrapper.setAttribute('data-scroll-animate', '4')
        }
    })

    const footerBg = document.querySelectorAll('.page-footer__bkgrd-circle')
    _.forEach(footerBg, (footerBgGroup) => {
        _.forEach(getChildNodes(footerBgGroup), (item) => {
            item.setAttribute('data-scroll-animate', '2')
        })
    })

    const fixSmallGap = document.querySelectorAll('.ob-container')

    _.forEach(fixSmallGap, (container) => {
        const containImageSmall = container.querySelector('.image--circle-small')
        if (!!containImageSmall) {
            const divider = container?.nextElementSibling?.querySelector('.divider.divider--02-h')
            const containerDivider = divider?.parentNode
            if (!!containerDivider) {
                container.style.marginBottom = '0px'
                containerDivider.style.marginTop = '0px'
            }
        }
    })

    const dividers = document.querySelectorAll('.divider')
    _.forEach(dividers, (item) => {
        if (isMobileView) {
            if (!item.parentNode?.parentNode?.classList.contains('two-image-media__caption')) {
                item.parentNode.style.marginTop = '40px'
                item.parentNode.style.marginBottom = '40px'
                // window.scrollTo({ top: 0 })
            }
        } else {
            item.parentNode.style.marginTop = ''
            item.parentNode.style.marginBottom = ''
        }
    })

    const dividerContainers = document.querySelectorAll('.container--divider')
    _.forEach(dividerContainers, (container) => {
        const item = container.querySelector('.divider')
        if (item) {
            item.setAttribute('data-aos', 'fade')
        }
    })

    const eventItem = document.querySelectorAll('.event-full-width-item')

    _.forEach(eventItem, (item) => {
        const date = item.querySelector('.event-thumbnail-item__date')
        const title = item.querySelector('.callout-3--black-left-2')
        const content = item.querySelector('.article-thumbnail-item__content')
        const button = item.querySelector('.button')
        addDataAOS([date, title, content, button], 'fade-up')
    })

    const eventListItem = document.querySelectorAll('.article-thumbnail-item')
    addDataAOS(eventListItem, 'fade-up')

    const accessItem = document.querySelectorAll('.accessibility-item')
    addDataAOS(accessItem, 'fade-up')

    const accessItemWrapper = document.querySelectorAll('.accessibility-item--wrapper')
    _.forEach(accessItemWrapper, (item) => {
        item.setAttribute('data-scroll-animate', '4')
    })

    const articleThumbnailListWrapper = document.querySelectorAll('.article-thumbnail-list-wrapper')
    addDataAOS(articleThumbnailListWrapper, 'fade-up')

    const cbf = document.querySelectorAll('.container--absolute-fullwidth')
    _.forEach(cbf, (item) => {
        const contentWrapper = item.querySelector('.content__wrapper')
        if (contentWrapper) {
            contentWrapper.setAttribute('data-scroll-animate', '4')
        }
    })

    const circleImageInfos = document.querySelectorAll('.circle-button-wrapper__content')
    addDataAOS(circleImageInfos, 'fade')

    const standardItem = document.querySelectorAll('.standard-item')
    addDataAOS(standardItem, 'fade-up')

    _.forEach(standardItem, (item) => {
        item.setAttribute('data-scroll-animate', '4')
    })

    const articleListThumbGroup = document.querySelectorAll('.article-thumbnail.article-thumbnail-group-wrapper')

    _.forEach(articleListThumbGroup, (item) => {
        item.setAttribute('data-scroll-animate', '4')
    })

    const articleImage = document.querySelectorAll('.article__image')
    _.forEach(articleImage, (item) => {
        item.setAttribute('data-scroll-animate', '2')
    })

    const carouselGallery = document.querySelectorAll('.carousel-wrapper.carousel-rich')
    _.forEach(carouselGallery, (item) => {
        item.setAttribute('data-scroll-animate', '2')
    })

    const articleDetail = document.querySelectorAll('.article__details')
    addDataAOS(articleDetail, 'fade')
    const articleInfo = document.querySelectorAll('.article__info')
    addDataAOS(articleInfo, 'fade')

    const buildingIframeWrapper = document.querySelectorAll('.interactive-3d-wrapper')
    _.forEach(buildingIframeWrapper, (item) => {
        // item.setAttribute('data-scroll-animate', '2')
        item.setAttribute('data-scroll-animate-position', 'top')
    })

    const contentCollapsedText = document.querySelectorAll('.content-collapse__wrapper')
    _.forEach(contentCollapsedText, (item) => {
        item.setAttribute('data-scroll-animate-position', 'middle')
    })

    const contentButtonList = document.querySelectorAll('.button-list')
    _.forEach(contentButtonList, (item) => {
        item.setAttribute('data-scroll-animate-position', 'bottom')
    })

    const circleButtonDescRemove = document.querySelectorAll('.circle-button-icon-description')
    removeDataAOS(circleButtonDescRemove)

    const circleButtonDesc = document.querySelectorAll('.circle-button-icon-description > div')
    addDataAOS(circleButtonDesc, 'zoom-in')

    const peopleQuote = document.querySelectorAll('.people-quote')
    addDataAOS(peopleQuote, 'fade-up')

    const stakeHolders = document.querySelectorAll('.stake-holders')
    addDataAOS(stakeHolders, 'fade-up')

    const aosItems = document.querySelectorAll('[data-aos]')
    _.forEach(aosItems, (item) => {
        item.removeAttribute('data-aos-offset')
        item.removeAttribute('data-aos-delay')
    })

    const circleButtonImageTransform = document.querySelectorAll('.circle-button-wrapper__content-image')
    _.forEach(circleButtonImageTransform, (item) => {
        item.style.removeProperty('transform')
        item.style.removeProperty('width')
    })

    const carouselObjects = document.querySelectorAll('.carousel > *[data-carousel-object]')

    _.forEach(carouselObjects, (object) => {
        const playIcon = htmlToElement(`<div class="carousel-object-playicon">
            <svg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'><path d='M35-.002c19.3 0 35 15.703 35 35.004C70 54.3 54.3 70 35 70 15.702 70 0 54.3 0 35.002 0 15.702 15.701-.002 35-.002zm0 3.79c-17.212 0-31.211 14.002-31.211 31.214 0 17.21 13.999 31.212 31.21 31.212 17.213 0 31.212-14.003 31.212-31.212 0-17.212-14-31.214-31.211-31.214zm-6.07 17.366c.561 0 1.119.154 1.61.442L48.79 32.24a3.168 3.168 0 0 1 1.585 2.762 3.164 3.164 0 0 1-1.585 2.762L30.54 48.41a3.197 3.197 0 0 1-1.61.439 3.207 3.207 0 0 1-3.203-3.201v-21.29a3.208 3.208 0 0 1 3.204-3.204zm.586 4.228v19.236L46.005 35l-16.489-9.618z' fill='#FFF' fill-rule='evenodd'/></svg></div>
    `)
        object.appendChild(playIcon)
    })

    const allDropdown = document.querySelectorAll('.custom-dropdown')
    _.forEach(allDropdown, (dropdown) => {
        dropdown.setAttribute('role', 'listbox')
        dropdown.setAttribute('tabindex', '0')
        dropdown.setAttribute('aria-haspopup', 'true')
        const options = dropdown.querySelectorAll('.custom-dropdown__item:not(.custom-dropdown__label)')
        _.forEach(options, (option) => {
            option.setAttribute('role', 'option')
            option.setAttribute('id', option.dataset.optionValue)
        })
    })

    const allCheckbox = document.querySelectorAll('.custom-checkbox')

    _.forEach(allCheckbox, (checkbox) => {
        checkbox.setAttribute('tabindex', '0')
    })

    const newsLetterDecors = document.querySelectorAll('.signup-newsletter__decoration > img')
    _.forEach(newsLetterDecors, (item) => {
        item.setAttribute('data-scroll-animate', '2')
    })

    const eventItems = document.querySelectorAll('.event-full-width-item')
    _.forEach(eventItems, (item) => {
        if (isMobileView) {
            item.setAttribute('data-scroll-animate', '2')
        } else {
            item.setAttribute('data-scroll-animate', '4')
        }
    })

    const eventImages = document.querySelectorAll('.event-full-width-item__image')
    _.forEach(eventImages, (item) => {
        if (isMobileView) {
            item.setAttribute('data-scroll-animate', '2')
        } else {
            item.setAttribute('data-scroll-animate', '4')
        }
    })

    AOS.refreshHard()

    const targetNode = document.body
    const config = { characterData: true, attributes: true, childList: true, subtree: true }

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                fixRecaptchaPosition()
            }
        }
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)
}

const updateHistoryItemGroupPlaceholder = (placeholder) => {
    const historyButtonGroup = document.querySelectorAll('.site-history__control-item-group')
    _.forEach(historyButtonGroup, (group) => {
        const activeHolder = group?.querySelector('.data-content-button--active')
        const ahRect = activeHolder?.getBoundingClientRect()
        const placeholder = group.parentNode.querySelector('.site-history__control-item-group-holder')
        if (ahRect) {
            placeholder.style.opacity = '1'
            placeholder.style.width = `${ahRect.width - 16}px`
            placeholder.style.left = `${ahRect.left + 8}px`
        }
    })
}

const initHistoryItemGroupPlaceholder = (group) => {
    const placeholder = htmlToElement('<div class="site-history__control-item-group-holder"></div>')
    group.parentNode.appendChild(placeholder)
    placeholder.style.opacity = '0'
    updateHistoryItemGroupPlaceholder(group, placeholder)
}

const initHistoryGroupPlaceholder = () => {
    const historyButtonGroup = document.querySelectorAll('.site-history__control-item-group')
    _.forEach(historyButtonGroup, (group) => {
        initHistoryItemGroupPlaceholder(group)
    })
}

const initSVGIconReplacement = () => {
    const buttonIcon = document.querySelectorAll('.circle-button-icon')
    _.forEach(buttonIcon, (item) => {
        const images = item.querySelectorAll('img')
        images.forEach((image) => {
            fetch(image.src)
                .then((res) => res.text())
                .then((data) => {
                    const parser = new DOMParser()
                    const svg = parser.parseFromString(data, 'image/svg+xml').querySelector('svg')
                    if (image.id) svg.id = image.id
                    if (image.className) svg.classList = image.classList
                    item.replaceChild(svg, image)
                })
                .catch((error) => console.error(error))
        })
    })
}

const initVerticalDivider = () => {
    const divider = document.querySelectorAll('.divider--v-01-h')
    _.forEach(divider, (item) => {
        const isContained = item.parentNode.classList.contains('container--left')
        if (isContained) {
            const containerInstance = item.parentNode
            if (isMobileView) {
                containerInstance.style.maxWidth = ''
            } else {
                if (window.innerWidth <= 1420) {
                    if (window.innerWidth <= 1210) {
                        containerInstance.style.maxWidth = 'calc(100vw - 70px - 64px)'
                    } else {
                        containerInstance.style.maxWidth = 'calc(100vw - max(304px, calc(30% - 60px)) - 70px - 64px)'
                    }
                } else {
                    containerInstance.style.maxWidth = ''
                }
            }
        }
    })
}

const overrideHistory = () => {
    setTimeout(() => {
        initHistoryGroupPlaceholder()
        updateHistoryItemGroupPlaceholder()
    }, 1500)

    document.removeEventListener('onHistoryChange', initHistoryGroupPlaceholder, true)
    document.addEventListener('onHistoryChange', initHistoryGroupPlaceholder, true)
    window.removeEventListener('resize', initHistoryGroupPlaceholder, true)
    window.addEventListener('resize', initHistoryGroupPlaceholder, true)
}

const overrideTabHeaders = () => {
    const tabs = document.querySelectorAll('.tabs.aem-GridColumn, .tab-container-wrapper, .tab-container-wrapper-top, .tab-container')
    _.forEach(tabs, (tab) => {
        const prevSib = tab.previousElementSibling
        const headerElName = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        if (prevSib) {
            if (prevSib.classList.contains('text') || _.includes(headerElName, prevSib.nodeName.toLowerCase())) {
                prevSib.classList.add('tab-header')
            }
        }
        const nextSib = tab.nextElementSibling
        if (nextSib && nextSib.classList.contains('ob-container')) {
            nextSib.classList.add('tab-content-container')
        }
    })
}

const overrideTextHeader = () => {
    const textPageHeader = document.querySelectorAll('.container--article-content-section')
    _.forEach(textPageHeader, (header) => {
        const parentTextHeader = header.parentNode
        if (parentTextHeader.classList.contains('article__wrapper')) {
            parentTextHeader.style.marginTop = '0px'
        }
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            override()
            overrideHistory()
            initVerticalDivider()
            window.addEventListener('resize', () => {
                override()
                initVerticalDivider()
            })
            initSVGIconReplacement()
            overrideTabHeaders()
            overrideTextHeader()
            console.log('Overriding script imported')
        }
    }, 100)
})()
