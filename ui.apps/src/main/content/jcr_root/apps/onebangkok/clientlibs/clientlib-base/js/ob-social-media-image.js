'use strict'

// import { getChildNodes, isMobileView } from './core.js'

let mosaryImageIsShown = false

const __getSocialMediaImage = () => {

    const node_name = document.getElementById("node_name");
    var current_page=window.location.href;
    var current_page_split = current_page.split(".html");
    var socialbanner = document.getElementsByClassName("socialbanner").length;
    if(socialbanner > 0) {
    axios.get(current_page_split[0] +'/jcr:content/root/container/'+node_name.value+'.model.json').then((res) => {
        var data_response_iterator = res["data"];
        var imagedetails_response_iterator = JSON.parse(data_response_iterator.imagedetails);
        const galleryElement = document.getElementById('social-media-images')
        galleryElement &&
            _.forEach(_.slice(imagedetails_response_iterator, 0, 10), (item) => {
                const imageWrapper = document.createElement('div')
                imageWrapper.className = 'image-layout__item--masonry'
                const image = document.createElement('img')
                image.src = item.url
                imageWrapper.appendChild(image)
                galleryElement.appendChild(imageWrapper)
            })

    })
}

}

const __initMasonryImage = () => {
    const masonryAnimate = document.querySelector('#social-media-images')
    if (masonryAnimate) {
        window.addEventListener('scroll', () => {
            const elRect = masonryAnimate.getBoundingClientRect()
            const elRectTop = elRect.top
            const allMasonryImage = document.querySelectorAll('.image-layout__item--masonry')

            let array = new Array()

            _.times(_.size(allMasonryImage), (index) => {
                array.push(index)
            })

            switch (_.size(allMasonryImage)) {
                case 3: {
                    masonryAnimate.style.flexDirection = 'column'
                    _.forEach(getChildNodes(masonryAnimate), (item) => {
                        item.style.width = '100%'
                    })
                    break
                }
                case 4: {
                    masonryAnimate.style.flexDirection = 'row'
                    const child = getChildNodes(masonryAnimate)
                    child[0].style.width = '50%'
                    child[1].style.width = '50%'
                    child[2].style.width = '100%'
                    child[3].style.width = '100%'
                    break
                }
                case 5: {
                    masonryAnimate.style.flexDirection = 'row'
                    const child = getChildNodes(masonryAnimate)
                    child[0].style.width = '50%'
                    child[1].style.width = '50%'
                    child[2].style.width = '100%'
                    child[3].style.width = '50%'
                    child[4].style.width = '50%'
                    break
                }
                case 6: {
                    masonryAnimate.style.flexDirection = 'row'
                    const child = getChildNodes(masonryAnimate)
                    child[0].style.width = '50%'
                    child[1].style.width = '50%'
                    child[2].style.width = '50%'
                    child[3].style.width = '50%'
                    child[4].style.width = '50%'
                    child[5].style.width = '50%'
                    break
                }
                case 7: {
                    masonryAnimate.style.flexDirection = 'row'
                    const child = getChildNodes(masonryAnimate)
                    child[0].style.width = '33.3333333333%'
                    child[1].style.width = '33.3333333333%'
                    child[2].style.width = '33.3333333333%'
                    child[3].style.width = '50%'
                    child[4].style.width = '50%'
                    child[5].style.width = '50%'
                    child[6].style.width = '50%'

                    break
                }
            }

            const shuffledArray = array.sort((a, b) => 0.5 - Math.random())
            if (allMasonryImage && shuffledArray && elRectTop - elRect.height / 4 <= 0 && !mosaryImageIsShown) {
                _.forEach(allMasonryImage, (item, index) => {
                    setTimeout(() => {
                        allMasonryImage[shuffledArray[index]].style.opacity = 1
                    }, 50 * index)
                })
                mosaryImageIsShown = true
            } else if (allMasonryImage && shuffledArray && elRectTop > window.innerHeight) {
                _.forEach(allMasonryImage, (item, index) => {
                    // allMasonryImage[shuffledArray[index]].style.opacity = 0
                })
                mosaryImageIsShown = false
            }
        })
    }
}

const __initDataSticky = () => {
    const animateScrollItems = document.querySelectorAll('[data-sticky-target]')

    _.forEach(animateScrollItems, (item, index) => {
        const maxwidth = isMobileView && window.innerWidth > 420 ? 'calc(100vw - 22px - 22px)' : '420px'
        item.style.maxWidth = maxwidth
        const clonedItem = item.cloneNode(true)
        clonedItem.classList.add('cloned-data-sticky')
        item.parentNode.appendChild(clonedItem)

        const startArea = document.querySelector(`[data-sticky-area=${item.dataset.stickyTarget}]`)

        clonedItem.style.margin = '0'
        clonedItem.style.position = 'fixed'
        if (startArea) {
            clonedItem.style.top = `${startArea.offsetTop}px`
        }
        clonedItem.style.visibility = 'hidden'
        clonedItem.style.width = maxwidth
        clonedItem.style.color = '#ffffff'
        clonedItem.style.zIndex = '3'
        clonedItem.style.pointerEvents = 'none'

        _.forEach(getChildNodes(clonedItem), (clonedItemChild) => {
            clonedItemChild.style.color = '#ffffff'
            _.forEach(getChildNodes(clonedItemChild), (clonedItemSubChild) => {
                clonedItemSubChild.style.color = '#ffffff'
            })
        })
    })

    window.addEventListener('scroll', () => {
        _.forEach(animateScrollItems, (item, index) => {
            const startArea = document.querySelector(`[data-sticky-area=${item.dataset.stickyTarget}]`)

            const clonedItem = item.parentNode.querySelector('.cloned-data-sticky')

            const startAreaRect = startArea.getBoundingClientRect()
            const clonedItemRect = clonedItem.getBoundingClientRect()
            const itemRect = item.getBoundingClientRect()

            const space = (itemRect.y - startAreaRect.y) / 100
            const fadeValue = Math.abs(clonedItemRect.y - itemRect.y) / space

            clonedItem.style.color = `hsl(0, 0%, ${fadeValue}%)`
            _.forEach(getChildNodes(clonedItem), (clonedItemChild) => {
                clonedItemChild.style.color = `hsl(0, 0%, ${fadeValue}%)`
                _.forEach(getChildNodes(clonedItemChild), (clonedItemSubChild) => {
                    clonedItemSubChild.style.color = `hsl(0, 0%, ${fadeValue}%)`
                })
            })

            if (clonedItemRect.y >= itemRect.y || startAreaRect.y > clonedItemRect.y) {
                clonedItem.style.visibility = 'hidden'
                startArea.style.opacity = '1'
                item.style.opacity = '1'
            }
            if (clonedItemRect.y < itemRect.y && startAreaRect.y <= clonedItemRect.y) {
                item.style.opacity = '0'
                startArea.style.opacity = '0'
                clonedItem.style.visibility = 'visible'
            }
        })
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __getSocialMediaImage()
            __initMasonryImage()
            __initDataSticky()

            console.log('Social media image monsary script imported')
        }
    }, 100)
})()
