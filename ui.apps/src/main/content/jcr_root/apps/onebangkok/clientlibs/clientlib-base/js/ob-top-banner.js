'use strict'

const __initTopBanner = () => {
    const topBannerAnimate = document.querySelector('#top-banner-animate-on-scroll')
    const topBannerAnimateImage = document.querySelector('#top-banner-animate-on-scroll-mask')
    if (topBannerAnimate && topBannerAnimateImage) {
        const scaling = () => {
            const offsetHeight = topBannerAnimate.offsetHeight
            const elRect = topBannerAnimate.getBoundingClientRect()
            const elRectTop = elRect.top
            const opacity = elRectTop <= 0 ? (elRectTop * -2) / (offsetHeight / (100 + 25)) / 100 : 0
            topBannerAnimate.style.opacity = opacity > 1 ? 1 : opacity

            const offset = `calc(60.7%)`

            if (opacity <= 1.5) {
                topBannerAnimateImage.style['clip-path'] = `circle(${opacity * 100}% at 50%  ${offset})`
            }
        }
        window.addEventListener('resize', () => {
            scaling()
        })
        window.addEventListener('scroll', () => {
            scaling()
        })
    }
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initTopBanner()
            console.log('Top banner script imported')
        }
    }, 100)
})()
