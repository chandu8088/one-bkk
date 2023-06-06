'use strict'

// import { isMobileView, disableScroll, enableScroll } from './core.js'

let isNavigationToggle = false

const setNavLogoLight = (pageLogo) => {
    pageLogo.querySelector('.light').style.opacity = 0
    pageLogo.querySelector('.dark').style.opacity = 1
}
const resetNavLogo = (pageLogo) => {
    pageLogo.querySelector('.light').style.opacity = 1
    pageLogo.querySelector('.dark').style.opacity = 0
}

const setNavHamburgerLight = (hamburger) => {
    hamburger.classList.add('lighter')
}
const resetNavHamburger = (hamburger) => {
    hamburger.classList.remove('lighter')
}

const setNavActionLight = (navActionGroup, navAction) => {
    navActionGroup.classList.add('lighter')
    _.forEach(navAction, (item) => {
        item.style.transition = '0.5s ease'
        item.style.color = '#ffffff'
    })
}
const resetNavAction = (navActionGroup, navAction) => {
    navActionGroup.classList.remove('lighter')
    _.forEach(navAction, (item) => {
        item.style.color = '#000000'
    })
}

const isInViewportHorizontal = (area, el) => {
    const areaRect = area.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()

    const inViewTop = areaRect.y < elRect.y + elRect.height / 2

    const inViewBottom = areaRect.y + areaRect.height > elRect.y + elRect.height / 2

    return inViewTop && inViewBottom
}

const toggleNavigation = () => {
    const pageNav = document.querySelector('#page-nav')
    const pageNavBackground = document.querySelector('#page-nav-background')
    const pageNavBackdrop = document.querySelector('#page-nav-backdrop')
    const pageNavContent = document.querySelector('#page-nav-content')
    const pageNavHamburger = document.querySelector('#page-nav-toggle')
    const pageLogo = document.querySelector('.page-nav-one-bangkok-logo')
    const navAction = document.querySelectorAll('.nav-contact__link, .nav-contact__description, .nav-action__language-selector, .nav-action__enquire')

    const nextState = !isNavigationToggle
    isNavigationToggle = nextState

    if (!pageNav) return

    if (nextState === true) {
        disableScroll()
        pageNav.classList.add('active')
        pageNavBackground.classList.add('active')
        pageNavBackdrop.classList.add('active')
        pageNavContent.classList.add('active')
        pageNavHamburger.classList.add('active')
        pageLogo.classList.add('active')
        _.forEach(navAction, (item) => {
            item.classList.add('active')
        })
    } else {
        enableScroll()
        pageNav.classList.remove('active')
        pageNavBackground.classList.remove('active')
        pageNavBackdrop.classList.remove('active')
        pageNavContent.classList.remove('active')
        pageNavHamburger.classList.remove('active')
        pageLogo.classList.remove('active')
        _.forEach(navAction, (item) => {
            item.classList.remove('active')
        })
    }
}

const __initNavs = () => {
    const pageNav = document.querySelector('#page-nav-toggle')
    if (!pageNav) return
    const pageNavBackdrop = document.querySelector('#page-nav-backdrop')
    pageNav?.addEventListener('click', () => toggleNavigation())
    pageNavBackdrop?.addEventListener('click', () => toggleNavigation())
}

const __initNavigationHandler = () => {
    const allDarkNavArea = document.querySelectorAll('[data-dark-nav]')
    if (!allDarkNavArea) return
    const darkNavArea = _.filter(allDarkNavArea, (item) => {
        return item.dataset.darkNav !== 'false'
    })

    const topBanner = document.querySelector('.top-banner__image-container')

    window.addEventListener('scroll', () => {
        const pageLogo = document.querySelector('.page-nav-one-bangkok-logo')

        const hamburger = document.querySelector('#page-nav-toggle')

        const navActionGroup = document.querySelector('.nav-action')
        const navAction = document.querySelectorAll(
            '.nav-contact__link, .nav-contact__description, .nav-action__language-selector, .nav-action__enquire'
        )

        if (!pageLogo) return

        const isLogoInDarkArea = _.map(darkNavArea, (area) => {
            const value = isInViewportHorizontal(area, pageLogo)
            return value
        })

        if (!hamburger) return

        const isHamburgerInDarkArea = _.map(darkNavArea, (area) => {
            const value = isInViewportHorizontal(area, hamburger)
            return value
        })

        if (!navActionGroup) return

        const isNavActionInDarkArea = _.map(darkNavArea, (area) => {
            const value = isInViewportHorizontal(area, navActionGroup.parentNode)
            return value
        })

        if (!navAction) return

        const renderNav = () => {
            if (!isMobileView) {
                if (_.includes(isLogoInDarkArea, true)) {
                    setNavLogoLight(pageLogo)
                } else {
                    resetNavLogo(pageLogo)
                }

                if (_.includes(isHamburgerInDarkArea, true)) {
                    setNavHamburgerLight(hamburger)
                } else {
                    resetNavHamburger(hamburger)
                }

                if (_.includes(isNavActionInDarkArea, true)) {
                    setNavActionLight(navActionGroup, navAction)
                } else {
                    resetNavAction(navActionGroup, navAction)
                }
            }
        }

        if (topBanner) {
            const topBannerRect = topBanner.getBoundingClientRect()

            if (topBannerRect.bottom > 65 && topBannerRect.bottom < window.innerHeight * 1.6) {
                if (isInViewportHorizontal(topBanner, navActionGroup)) {
                    setNavActionLight(navActionGroup, navAction)
                } else {
                    renderNav()
                }

                if (isInViewportHorizontal(topBanner, hamburger)) {
                    setNavHamburgerLight(hamburger)
                } else {
                    renderNav()
                }

                if (isInViewportHorizontal(topBanner, pageLogo)) {
                    setNavLogoLight(pageLogo)
                    return
                } else {
                    renderNav()
                }
            }
        }

        renderNav()
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initNavs()
            __initNavigationHandler()
            console.log('Navigation script imported')
        }
    }, 100)
})()
