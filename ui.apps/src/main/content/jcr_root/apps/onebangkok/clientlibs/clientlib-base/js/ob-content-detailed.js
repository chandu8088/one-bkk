'use strict'

const __initDetailedContent = () => {
    const modalWrapper = document.querySelectorAll('.floor-plan-modal')

    _.forEach(modalWrapper, (item) => {
        if (item.parentNode) {
            item.parentNode.classList.add('modal--carousel-image-content__fixed-scroll')
        }
    })
    const wrappers = document.querySelectorAll('.detailed-content')

    let configWidth = 0
    let configHeight = 0

    _.forEach(wrappers, (wrapper) => {
        const handleGetDimension = () => {
            const parentWrapper = wrapper.parentNode.parentNode

            if (!parentWrapper.classList.contains('tab-content--inactive')) {
                configWidth = parentWrapper.getBoundingClientRect().width
                configHeight = parentWrapper.getBoundingClientRect().height
            }
        }

        handleGetDimension()

        const frame = wrapper.parentNode
        const wzoom = WZoom.create(wrapper, {
            type: 'image',
            // height: configHeight,
            // width: configWidth,
            dragScrollableOptions: {
                // smoothExtinction: 0,
                onGrab: function () {
                    if (wrapper.classList.contains('zoomed')) {
                        frame.style.cursor = 'grabbing'
                    }
                },
                onDrop: function () {
                    if (wrapper.classList.contains('zoomed')) {
                        frame.style.cursor = 'grab'
                    }
                },
            },
            // minScale: 1,
            maxScale: 2,
            zoomOnClick: false,
            disableWheelZoom: true,
            // smoothExtinction: 0,
        })

        var ob = new MutationObserver(function () {
            wrapper.classList.add('force-disable-animation')
            setTimeout(() => {
                wrapper.classList.remove('force-disable-animation')
            }, 250)

            wzoom.prepare()
        })

        const parentWrapper = wrapper?.parentNode?.parentNode
        const parentModal = parentWrapper?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode

        ob.observe(parentModal, {
            attributes: true,
            attributeFilter: ['class'],
        })

        wrapper.classList.add('ready')

        const zoomBtn = wrapper.parentNode.parentNode.querySelector('.detailed-zoom-btn')
        zoomBtn.addEventListener('click', () => {
            if (wrapper.classList.contains('zoomed')) {
                wzoom.maxZoomDown()
                wrapper.classList.remove('zoomed')
                frame.style.cursor = 'default'
            } else {
                const pointX = (wrapper.getBoundingClientRect().width / 2) * 2
                const pointY = (wrapper.getBoundingClientRect().height / 2) * 2
                // wzoom.maxZoomUpToPoint({ x: pointX, y: pointY })
                wzoom.maxZoomUp()
                wrapper.classList.add('zoomed')
                frame.style.cursor = 'grab'
            }
        })
        const clearBtns = wrapper.parentNode.parentNode.parentNode.parentNode.querySelectorAll('.detailed-clear-btn')
        _.forEach(clearBtns, (btn) => {
            btn.addEventListener('click', () => {
                wrapper.classList.add('force-disable-animation')
                setTimeout(() => {
                    wrapper.classList.remove('force-disable-animation')
                }, 250)

                wzoom.prepare()
                wzoom.maxZoomDown()

                frame.style.cursor = 'default'
            })
        })
        window.addEventListener('resize', () => {
            handleGetDimension()
            wzoom.prepare()
        })
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initDetailedContent()
            console.log('Content detailed script imported')
        }
    }, 100)
})()
