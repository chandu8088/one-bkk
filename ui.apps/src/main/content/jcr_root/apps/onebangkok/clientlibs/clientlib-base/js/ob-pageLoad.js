const __initPageBeforeLoaded = () => {
    _.forEach(allLoadedSection, (item) => {
        document.body.setAttribute('data-page-reveal', 'animated')
        item.style.opacity = 0
        item.style.transform = 'translateY(50px)'
    })

    const pageDivider = document.querySelector('.ob-container.container--left.container--divider')
    if (pageDivider?.nextElementSibling) {
        pageDivider.nextElementSibling.style.marginTop = '80px'
    }
}

;(function () {
    let stateCheck = setInterval(() => {
        // if (document.readyState === 'complete') {
        clearInterval(stateCheck)
        __initPageBeforeLoaded()
        console.log('Overriding script imported')
        // }
    }, 100)
})()
