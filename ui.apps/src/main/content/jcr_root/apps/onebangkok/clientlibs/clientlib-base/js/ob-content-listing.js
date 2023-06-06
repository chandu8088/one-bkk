'use strict'

// import { htmlToElement, getChildNodes, normalizePagination, getCounterText } from './core.js'

const onListingFilterChanged = new Event('onFilterChanged')

const onPageChangedGoToTop = true

const CONTENT_CONFIG = {
    maximumItemPerPage: 9,
}

let CONTENT_LISTING = {
    page: {
        currentFilter: null,
        filterKey: null,
        currentPage: 0,
        offset: 0,
        data: [],
        showing: {
            start: 0,
            end: CONTENT_CONFIG.maximumItemPerPage - 1,
        },
    },
}

const setPageCounter = () => {
    const config = CONTENT_LISTING.page
    const counterEl = document.querySelector('[data-content-showing-counter=page]')

    if (counterEl) {
        const filteredData = _.filter(config.data, (item) => {
            if (config.currentFilter === null || config.currentFilter === 'all') {
                return true
            } else {
                return item[config.filterKey] == config.currentFilter
            }
        })

        const size = _.size(filteredData)

        counterEl.innerHTML = getCounterText(config.showing.start + 1, config.showing.end + 1 + config.offset, size)
    }
}

const generateDropdownFilter = (name, value, active = false) => {
    let item = `<div class="custom-dropdown__item ${active ? 'active' : ''}" data-option-value="${value}" data-option-name="${name}">
        ${name}<img src="/etc.clientlibs/onebangkok/clientlibs/clientlib-base/resources/images/icons/icons-checked.svg" />
    </div>`
    return htmlToElement(item)
}

const setPagePagination = (activePage = null) => {
    if (activePage !== null) {
        CONTENT_LISTING.page.currentPage = activePage
    }

    const paginationDots = document.querySelector('.pagination--dots')
    const config = CONTENT_LISTING.page

    const filteredData = _.filter(config.data, (item) => {
        if (config.currentFilter === null || config.currentFilter === 'all') {
            return true
        } else {
            return item[config.filterKey] == config.currentFilter
        }
    })

    const dataChunk = _.chunk(filteredData, CONTENT_CONFIG.maximumItemPerPage)

    const fragment = document.createDocumentFragment()

    const prevBtn = paginationDots.parentNode.querySelector('.pagination__back-btn')

    const nextBtn = paginationDots.parentNode.querySelector('.pagination__next-btn')

    let currentActiveDot = null
    _.forEach(getChildNodes(paginationDots), (item, index) => {
        if (item.classList.contains('active')) {
            currentActiveDot = index
        }
        item.remove()
    })

    let newActiveDot = null

    _.times(_.size(dataChunk), (index) => {
        const node = document.createElement('div')
        if (index === config.currentPage) {
            node.classList.add('active')
            newActiveDot = index
        }
        node.addEventListener('click', () => {
            reRenderPageContent({ page: index })
            onPageChangedGoToTop && window.scrollTo({ top: 0, behavior: 'smooth' })
        })
        fragment.appendChild(node)
    })

    paginationDots.appendChild(fragment)
    normalizePagination(currentActiveDot, newActiveDot)

    if (config.currentPage > 0) {
        prevBtn.classList.remove('disabled')
    } else {
        prevBtn.classList.add('disabled')
    }

    if (config.currentPage < _.size(dataChunk) - 1) {
        nextBtn.classList.remove('disabled')
    } else {
        nextBtn.classList.add('disabled')
    }
    let requestUpdatePagination = new Event('requestUpdatePagination')
    document.dispatchEvent(requestUpdatePagination)
}

const reRenderPageContent = ({ page = 0, filter = null, loadmore = false }) => {
    if (typeof page !== 'undefined') {
        setPagePagination(page)
    }

    if (filter) {
        setPagePagination(0)
        CONTENT_LISTING.page.offset = 0
        CONTENT_LISTING.page.currentFilter = filter
    }

    const config = CONTENT_LISTING.page
    const contentWrapperEl = document.querySelector(`[data-content-listing=page]`)

    const filteredData = _.filter(config.data, (item) => {
        if (config.currentFilter === null || config.currentFilter === 'all') {
            return true
        } else {
            return item[config.filterKey] == config.currentFilter
        }
    })
    const dataChunk = _.chunk(filteredData, CONTENT_CONFIG.maximumItemPerPage + config.offset)

    if (contentWrapperEl) {
        let dataToShown

        if (!loadmore) {
            contentWrapperEl.innerHTML = ''
            dataToShown = dataChunk[config.currentPage]
        } else {
            dataToShown = _.slice(dataChunk[config.currentPage], config.offset)
        }

        _.forEach(dataToShown, (item) => {
            let el = generateArticleThumbnail({
                head: item.heading,
                summary: item.summary,
                date: item.date,
                ctaUrl: item.ctaUrl,
                imgAlt: item.thumbnailalttext,
                year: item.year,
                imgUrl: item.url,
                ctaLabel: item.ctaLabel,
            })
            contentWrapperEl.appendChild(el)
        })

        CONTENT_LISTING.page = {
            ...CONTENT_LISTING.page,
            showing: {
                start: config.currentPage * CONTENT_CONFIG.maximumItemPerPage,
                end: config.currentPage * CONTENT_CONFIG.maximumItemPerPage + _.size(dataToShown) - 1,
            },
        }

        setPageCounter()
        setPagePagination(page)

        const loadMoreBtn = document.querySelector('[data-content-loadmore=page]')

        if (CONTENT_LISTING.page.offset + CONTENT_CONFIG.maximumItemPerPage >= _.size(filteredData)) {
            loadMoreBtn.style.display = 'none'
        } else {
            loadMoreBtn.style.display = ''
        }
    }
}

const renderPageContent = ({ els = [], filter = [] }) => {
    const config = CONTENT_LISTING.page
    const contentWrapperEl = document.querySelector(`[data-content-listing=page]`)
    const contentFilterEl = document.querySelector(`[data-content-filter=page]`)
    const pagination = document.querySelector('.pagination')
    const emptyResult = contentWrapperEl?.nextElementSibling

    if (_.size(els) <= CONTENT_CONFIG.maximumItemPerPage) {
        const loadMoreBtn = document.querySelector('[data-content-loadmore=page]')
        loadMoreBtn.style.display = 'none'
    }
    if (_.size(els) == 0) {
        // pagination.classList.add('hidden')
        emptyResult?.classList.remove('hidden')
        return false
    } else {
        pagination.classList.remove('hidden')
        emptyResult?.classList.add('hidden')
    }

    const dataChunk = _.chunk(els, CONTENT_CONFIG.maximumItemPerPage)
    if (contentWrapperEl) {
        const dataToShown = dataChunk[0]
        _.forEach(dataToShown, (item) => {
            contentWrapperEl.appendChild(item)
        })
    }

    if (contentFilterEl) {
        const optionsWrapperEl = document.querySelector('.custom-dropdown__options')

        const filterOptionEl = _.map(_.orderBy(filter, 'value', 'desc'), (item) => {
            let el = generateDropdownFilter(item.name, item.value)
            return el
        })

        // const defaultFilterLabel = document.getElementById('defaultFilterLabel')?.value

        // const filterEls = [generateDropdownFilter(defaultFilterLabel, 'all', true)].concat(filterOptionEl)

        const filterEls = filterOptionEl

        _.forEach(filterEls, (item) => {
            optionsWrapperEl.appendChild(item)
        })
        _.forEach(getChildNodes(document.querySelector('.custom-dropdown__options')), (item) => {
            item.addEventListener('click', () => {
                reRenderPageContent({ filter: item.dataset.optionValue })
            })
        })
        document.dispatchEvent(onListingFilterChanged)

        setPageCounter()
        setPagePagination()

        const prevBtn = pagination.querySelector('.pagination__back-btn')

        const nextBtn = pagination.querySelector('.pagination__next-btn')

        const filteredData = _.filter(config.data, (item) => {
            if (config.currentFilter === null || config.currentFilter === 'all') {
                return true
            } else {
                return item[config.filterKey] == config.currentFilter
            }
        })
        const dataChunk = _.chunk(filteredData, CONTENT_CONFIG.maximumItemPerPage)

        prevBtn.addEventListener('click', () => {
            const config = CONTENT_LISTING.page
            if (config.currentPage > 0) {
                reRenderPageContent({ page: config.currentPage - 1 })
                onPageChangedGoToTop && window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        })

        nextBtn.addEventListener('click', () => {
            const config = CONTENT_LISTING.page
            if (config.currentPage < _.size(dataChunk) - 1) {
                reRenderPageContent({ page: config.currentPage + 1 })
                onPageChangedGoToTop && window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        })

        const loadMoreBtn = document.querySelector('[data-content-loadmore=page]')

        loadMoreBtn?.addEventListener('click', () => {
            const newOffset = CONTENT_LISTING.page.offset + CONTENT_CONFIG.maximumItemPerPage
            CONTENT_LISTING.page.offset = newOffset
            console.log(
                '🚀 ~ file: ob-content-listing.js ~ line 276 ~ loadMoreBtn?.addEventListener ~ newOffset + CONTENT_CONFIG.maximumItemPerPage',
                newOffset + CONTENT_CONFIG.maximumItemPerPage,
                _.size(filteredData)
            )
            if (newOffset + CONTENT_CONFIG.maximumItemPerPage >= _.size(filteredData)) {
                loadMoreBtn.style.display = 'none'
            }

            reRenderPageContent({ loadmore: true })
        })
    }
    let requestUpdatePagination = new Event('requestUpdatePagination')
    document.dispatchEvent(requestUpdatePagination)
}

const generateArticleThumbnail = ({ head, summary, date, ctaUrl, imgAlt, year, imgUrl, ctaLabel }) => {
    // const dateText = date ? `${dayjs(date).format('MMM D, YYYY')}` : ''
    let item = `<div class="article-thumbnail-item">
                    <a class="article-thumbnail-item__image">
                        <img src="${imgUrl}" alt="${imgAlt}" />
                    </a>
                <div class="article-thumbnail-item__date">${date}</div>
                <div class="callout-3--black-left">${head}</div>
                    <p class="body-2--black-left article-thumbnail-item__content">
                        ${summary}
                    </p>
                    <a class="button button--text" href="${ctaUrl}">
                ${ctaLabel}
                        <svg width="26" height="16" viewBox="0 0 26 16" xmlns="http://www.w3.org/2000/svg">
                            <path
                            d="M8.125 0C3.547 0 0 3.582 0 7.795 0 12.418 3.547 16 8.125 16c3.988 0 7.405-3.273 7.698-7.6h5.844v2L26 8l-4.333-2.4v2l-5.827.001v-.048C15.707 3.445 12.217 0 8.125 0zm-.203 15.2C3.984 15.2.792 11.976.792 8S3.984.8 7.922.8c3.805 0 6.913 3.01 7.119 6.8H8.273v.8h6.841c-.206 3.79-3.314 6.8-7.12 6.8z"
                            fill="#000"
                            fill-rule="evenodd"
                            />
                        </svg>
                    </a>
                </div>`
    return htmlToElement(item)
}

const initPageListing = (url) => {
    const reqUrl = `${url}`

    let els = []
    let filter = []

    axios.get(reqUrl).then((res) => {
        const responseData = JSON.parse(res.data.newsDetails)
        // const responseData = res.data
        _.forEach(
            _.filter(responseData, (item) => true),
            (item) => {
                els.push(
                    generateArticleThumbnail({
                        head: item.heading,
                        summary: item.summary,
                        date: item.date,
                        ctaUrl: item.ctaUrl,
                        imgAlt: item.thumbnailalttext,
                        year: item.year,
                        imgUrl: item.url,
                        ctaLabel: item.ctaLabel,
                    })
                )

                filter.push({ name: item.year, value: item.year })

                CONTENT_LISTING.page = { ...CONTENT_LISTING.page, currentPage: 0, data: responseData, filterKey: 'year' }
            }
        )

        renderPageContent({
            els,
            filter: _.uniqBy(filter, 'value'),
        })
    })
}

const __initContentListing = () => {
    const dataContentRenderingContainer = document.querySelectorAll('[data-content-render]')
    var current_page=window.location.href;
    var current_page_split = current_page.split(".html");
    _.forEach(dataContentRenderingContainer, (contentRender) => {
        if (contentRender.dataset.contentRender === 'page') {
            console.log('found-page-render')

            initPageListing(current_page_split[0] +'/jcr:content/root/container/newslist.model.json')
            // initPageListing('https://xieranmaya.github.io/images/cats/cats.json')
        }
    })
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initContentListing()
            console.log('Init page listing script imported')
        }
    }, 100)
})()
