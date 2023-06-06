'use strict'

const __initFullwidthBanner = () => {
    const banners = document.querySelectorAll('.full-screen-banner')

    _.forEach(banners, (banner) => {
        const videos = banner.querySelectorAll('video')
        _.forEach(videos, (video) => {
            video.setAttribute('playsinline', '')

            const cloned = video.cloneNode(true)
            video.parentNode.insertBefore(cloned, video)
            video.remove()
        })
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initFullwidthBanner()
            console.log('Full width banner script imported')
        }
    }, 100)
})()
