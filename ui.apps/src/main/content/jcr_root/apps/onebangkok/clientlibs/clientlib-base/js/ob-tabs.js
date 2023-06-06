'use strict'

const obTabChanged = new Event('obTabChanged')

const __initTabs = () => {
    const tabsWrapper = document.querySelectorAll('.tab__wrapper')
    _.forEach(tabsWrapper, (item) => {
        const parentContainer = item.parentNode.parentNode
        const tabContainer = item.parentNode
        if (tabContainer && parentContainer && parentContainer.classList.contains('ob-container')) {
            parentContainer.classList.add('tab-container')

            const exclusion = ['expereiences-content-wrapper', 'article-list-with-pagination']
            if (_.filter((ex) => tabContainer.nextElementSibling.classList.contains(ex))) {
                tabContainer.classList.add('tab-container-wrapper-top')
            } else {
                tabContainer.classList.add('tab-container-wrapper')
            }
        }
    })
    const tabs = document.querySelectorAll('[data-tab-target]')

    if (window.location.hash) {
        const [tabGroupPre, tabTarget] = window.location.hash.split('_')

        const tabGroup = tabGroupPre.substring(1)

        const tabsInGroup = document.querySelectorAll(`.tab__item[data-tab-group=${tabGroup}]`)

        if (
            _.includes(
                _.map(tabsInGroup, (item) => item.dataset.tabTarget),
                tabTarget
            )
        ) {
            _.forEach(tabsInGroup, (tab) => {
                if (tab.dataset.tabTarget === tabTarget) {
                    tab.classList.remove('inactive')
                    tab.classList.add('active')
                } else {
                    tab.classList.remove('active')
                    tab.classList.add('inactive')
                }

                const tabsContent = document.querySelectorAll(`.tab-content[data-tab-group=${tabGroup}]`)

                tabsContent.forEach((tabContent) => {
                    tabContent.classList.remove('tab-content--active')
                    tabContent.classList.add('tab-content--inactive')
                })
                const targetTabContent = document.querySelector(`[data-tab-content=${tabTarget}][data-tab-group=${tabGroup}]`)

                targetTabContent?.classList.remove('tab-content--inactive')
                targetTabContent?.classList.add('tab-content--active')
            })
        }
    }
    tabs.forEach((tab) => {
        if (tab.classList.contains('active')) {
            const tabParentRect = tab.parentNode.getBoundingClientRect()

            const halfPosition = tabParentRect.left + tabParentRect.width / 2

            const scrollValueToCenter = tab.offsetLeft - halfPosition + tab.offsetWidth / 2 + tabParentRect.left

            tab.parentNode.scroll(scrollValueToCenter, 0)
        }
        tab.addEventListener('click', (e) => {
            e.preventDefault()
            const tabParentRect = tab.parentNode.getBoundingClientRect()

            const halfPosition = tabParentRect.left + tabParentRect.width / 2

            const scrollValueToCenter = tab.offsetLeft - halfPosition + tab.offsetWidth / 2 + tabParentRect.left

            tab.parentNode.scroll({
                top: 0,
                left: scrollValueToCenter,
                behavior: 'smooth',
            })

            // Handle Tab Link
            const tabsInGroup = document.querySelectorAll(
                `.tab__item[data-tab-group=${tab.dataset.tabGroup}],.selection-group__item[data-tab-group=${tab.dataset.tabGroup}]`
            )

            tabsInGroup.forEach((tab) => {
                tab.classList.remove('active')
                tab.classList.add('inactive')
            })

            tab.classList.remove('inactive')
            tab.classList.add('active')
            if (tab.dataset.tabPopup !== 'yes') {
                window.location.href = `#${tab.dataset.tabGroup}_${tab.dataset.tabTarget}`
            } else {
                // __initDetailedContent()
            }
            // Handle Tab Content
            const tabsContent = document.querySelectorAll(`[data-tab-group=${tab.dataset.tabGroup}]`)
            tabsContent.forEach((tabContent) => {
                tabContent.classList.remove('tab-content--active')
                tabContent.classList.add('tab-content--inactive')
            })

            const activeTabContents = document.querySelectorAll(`[data-tab-content=${tab.dataset.tabTarget}][data-tab-group=${tab.dataset.tabGroup}]`)

            _.forEach(activeTabContents, (activeTabContent) => {
                activeTabContent?.classList.remove('tab-content--inactive')
                activeTabContent?.classList.add('tab-content--active')
            })

            document.dispatchEvent(obTabChanged)
        })
        document.dispatchEvent(obTabChanged)
    })
}

const __initStickyTab = () => {
    const tabs = document.querySelectorAll('.tab.tab--sticky')
    // if (_.size(tabs > 1)) {
    //     return
    //     // Found multiple tabs in same page (not tab page)
    // }

    _.forEach(tabs, (tab) => {
        const contentWrapper = tab?.parentNode?.nextElementSibling
        const tabParent = tab?.parentNode

        if (contentWrapper) {
            const offsetTop = !isMobileView ? 45 : 80
            const contentOffset = !isMobileView ? 144 + 45 : 96 + 80

            const tabsItems = tab.querySelectorAll('.tab__item')
            _.forEach(tabsItems, (tabItem) => {
                tabItem.addEventListener('click', () => {
                    const contentRect = contentWrapper.getBoundingClientRect()

                    window.scrollBy({ top: contentRect.top - offsetTop - contentOffset, behavior: 'smooth' })
                })
            })
            window.addEventListener('scroll', () => {
                // const tabHolder = document.prevdocument.querySelector('.tab--placeholder')
                const tabHolder = tab.previousElementSibling

                const tabRect = tabHolder ? tabHolder?.getBoundingClientRect() : tab?.getBoundingClientRect()

                const contentRect = contentWrapper.getBoundingClientRect()
                const pushUpValue = contentRect.bottom - window.innerHeight

                const shouldStick = contentRect.top + contentRect.height - tabRect.top + tabRect.height > window.innerHeight

                if (tabRect.top <= offsetTop && shouldStick) {
                    if (!tab.classList.contains('tab--fixed')) {
                        const placeholderTab = tab.cloneNode(true)
                        placeholderTab.classList.add('tab--placeholder')
                        tab.parentNode.insertBefore(placeholderTab, tab)
                        tab.classList.add('tab--fixed')
                    }
                } else {
                    const stickyTab = tabParent.querySelector('.tab--fixed')
                    stickyTab?.classList.remove('tab--fixed')

                    const placeholderTab = tabParent.querySelector('.tab--placeholder')
                    placeholderTab?.remove()
                }

                if (contentWrapper) {
                    const stickyTab = tabParent.querySelector('.tab--fixed')

                    if (stickyTab && pushUpValue < 0) {
                        stickyTab.style.transform = `translateY(${pushUpValue}px)`
                    }
                    if (stickyTab && pushUpValue >= 0) {
                        stickyTab.style.transform = `translateY(0px)`
                    }
                }
            })
        }
    })
}

const tabReducer = () => {
    const resetTabClass = () => {
        const activeTabContent = document.querySelectorAll('.tab-content--active')

        _.forEach(activeTabContent, (tabContent) => {
            if (tabContent.dataset.tabModified || tabContent.parentNode?.dataset.tabModified) {
                // TabParent
                const tabParentChanges = tabContent.parentNode?.dataset.tabModified && JSON.parse(tabContent.parentNode?.dataset.tabModified)

                if (tabParentChanges) {
                    _.forEach(tabParentChanges.removed, (className) => {
                        tabContent.parentNode.classList.add(className)
                    })
                    _.forEach(tabParentChanges.added, (className) => {
                        tabContent.parentNode.classList.remove(className)
                    })

                    tabContent.parentNode.removeAttribute('data-tab-modified')
                }

                // TabContent
                const tabContentChanges = tabContent.dataset.tabModified && JSON.parse(tabContent.dataset.tabModified)

                if (tabContentChanges) {
                    _.forEach(tabContentChanges.removed, (className) => {
                        tabContent.querySelector('[data-tab-content-modified]')?.classList.add(className)
                    })
                    _.forEach(tabContentChanges.added, (className) => {
                        tabContent.querySelector('[data-tab-content-modified]')?.classList.remove(className)
                    })
                    tabContent.removeAttribute('data-tab-modified')
                }
            }
        })
    }

    const reinintTabContent = () => {
        const activeTabContent = document.querySelectorAll('.tab-content--active')

        _.forEach(activeTabContent, (tabContent) => {
            const largeTab = tabContent.querySelector('.container--large')
            const largeTabTwo = tabContent.querySelector('.container--left-large')
            const tabRich = tabContent.querySelector('.carousel-rich')
            const tabContainer = tabContent.querySelector('.ob-container.container--left')
            if (largeTab) {
                tabContent.parentNode.classList.remove('container--left')
                tabContent.parentNode.classList.add('container--large')

                tabContent.parentNode.setAttribute(
                    'data-tab-modified',
                    JSON.stringify({
                        removed: ['container--left'],
                        added: ['container--large'],
                    })
                )

                largeTab.classList.remove('container--large')
                largeTab.setAttribute('data-tab-content-modified', 'true')

                tabContent.setAttribute(
                    'data-tab-modified',
                    JSON.stringify({
                        removed: ['container--large'],
                        added: [],
                    })
                )
            } else if (largeTabTwo) {
                tabContent.parentNode.classList.remove('container--left')
                tabContent.parentNode.classList.add('container--left-large')

                tabContent.parentNode.setAttribute(
                    'data-tab-modified',
                    JSON.stringify({
                        removed: ['container--left'],
                        added: ['container--left-large'],
                    })
                )

                largeTabTwo.classList.remove('container--left-large')
                largeTabTwo.setAttribute('data-tab-content-modified', 'true')

                tabContent.setAttribute(
                    'data-tab-modified',
                    JSON.stringify({
                        removed: ['container--left-large'],
                        added: [],
                    })
                )
            } else if (tabRich) {
                tabContent.parentNode.classList.remove('ob-container', 'container--left')

                tabContent.parentNode.setAttribute(
                    'data-tab-modified',
                    JSON.stringify({
                        removed: ['ob-container', 'container--left'],
                        added: [],
                    })
                )
            } else if (tabContainer) {
                tabContainer.classList.remove('ob-container', 'container--left')
                tabContainer.setAttribute('data-tab-content-modified', 'true')
            }
        })
    }

    resetTabClass()
    reinintTabContent()
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initTabs()
            __initStickyTab()
            tabReducer()
            document.addEventListener('obTabChanged', () => {
                tabReducer()
            })
            console.log('Tabs script imported')
        }
    }, 100)
})()
