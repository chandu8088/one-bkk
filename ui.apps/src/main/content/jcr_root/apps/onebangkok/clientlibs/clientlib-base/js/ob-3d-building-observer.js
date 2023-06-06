const dispatchEventTowerChange = () => {
    const targetNode = document.querySelector('#active-tower')

    if (targetNode) {
        const targetNodeValue = targetNode.innerText
        const onBuildingChange = new CustomEvent('onBuildingChange', {
            detail: `iframeContentTriggerId:${targetNodeValue}`,
        })
        if (targetNodeValue) {
            window.dispatchEvent(onBuildingChange)
        }
    }
}

const __initMutationObserver = () => {
    const targetNode = document.querySelector('#active-tower')
    const config = { characterData: false, attributes: false, childList: true, subtree: false }

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                dispatchEventTowerChange()
            }
        }
    }

    const observer = new MutationObserver(callback)
    if (!targetNode) {
        return console.log('no #active-tower element to observed')
    }
    observer.observe(targetNode, config)
}

const __initBuildingEventListener = () => {
    window.addEventListener(
        'onBuildingChange',
        (event) => {
            if (event.detail) {
                const [eventType, dataId] = event.detail.split(':')

                if (eventType === 'iframeContentTriggerId' && dataId) {
                    const targetContent = document.querySelector(`[data-iframe-content-trigger-id="${dataId}"]`)

                    if (targetContent) {
                        const group = targetContent.parentNode
                        if (group) {
                            console.log(`eventType: ${eventType}, recieved data-iframe-content-trigger-id: ${dataId}`)
                            const allContent = group.querySelectorAll('[data-iframe-content-trigger-id]')
                            _.forEach(allContent, (contentGroup) => {
                                if (contentGroup.dataset.iframeContentTriggerId !== dataId) {
                                    contentGroup.style.display = 'none'
                                } else {
                                    contentGroup.style.removeProperty('display')
                                }
                            })
                        }
                    } else {
                        console.log(`eventType: ${eventType}, recieved invalid data-iframe-content-trigger-id`)
                    }
                }
            }
        },
        false
    )
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initMutationObserver()
            __initBuildingEventListener()
            dispatchEventTowerChange()
            console.log('3d building observer script imported')
        }
    }, 100)
})()
