'use strict'

const __initFullScreenBanner = () => {
    const banner = document.querySelectorAll('.full-screen-banner')
    _.forEach(banner, (item) => {
        const closeBtn = item.querySelector('.full-screen-banner__close-btn')
        const banner = item.querySelector('.full-screen-banner__content--iframe')
        const thumb = item.querySelector('.full-screen-banner__thumb')
        const toggleBtn = item.querySelector('.full-screen-banner__toggle-btn')
        const contentOverlay = item.querySelector('.full-screen-banner__content')

        const toggleBanner = () => {
            if (banner.classList.contains('active')) {
                banner.classList.remove('active')
                thumb.classList.remove('hidden')
                contentOverlay.classList.remove('hidden')
                banner.scrollIntoView()
                enableScroll()
            } else {
                banner.classList.add('active')
                thumb.classList.add('hidden')
                contentOverlay.classList.add('hidden')
                banner.scrollIntoView()
                disableScroll()
            }
        }
        closeBtn?.addEventListener('click', () => {
            toggleBanner()
        })
        toggleBtn?.addEventListener('click', () => {
            toggleBanner()
        })
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initFullScreenBanner()
            console.log('Full screen banner script imported')
        }
    }, 100)
})()
