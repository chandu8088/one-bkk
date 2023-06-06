'use strict'

// import { getChildNodes, getCounterText, isMobileView, htmlToElement } from './core.js'

const onReportFilterChanged = new Event('onFilterChanged')

const MAXIMUM_ITEM_PER_PAGE = 8

const updateReportCounter = (list) => {
    const counterEl = list.parentNode.parentNode.querySelector('.counter')

    const filteredContent = _.filter(getChildNodes(list), (listItem) =>
        list.dataset.filterCurrent === 'all' ? listItem : listItem.dataset.filter === list.dataset.filterCurrent
    )

    _.forEach(filteredContent, (item, index) => {
        item.setAttribute('data-index', index + 1)
    })

    const displayedContent = _.filter(filteredContent, (item) => !item.classList.contains('hidden'))

    const start = _.first(displayedContent).dataset.index
    const end = _.last(displayedContent).dataset.index

    counterEl.innerHTML = getCounterText(start, end, _.size(filteredContent))
}

const updateReportPagination = (list, currentPage, scrollToTop = true) => {
    if (list.dataset.paginationCurrent === currentPage.toString()) {
        return false
    }
    list.setAttribute('data-pagination-current', currentPage.toString())

    const pagination = list.parentNode.parentNode.querySelector('.pagination-desktop')
    const dotsWrapper = pagination.querySelector('.pagination--dots')

    const nextBtn = pagination.querySelector('.pagination__next-btn')
    const backBtn = pagination.querySelector('.pagination__back-btn')

    if (currentPage > 0) {
        backBtn.classList.remove('disabled')
    } else {
        backBtn.classList.add('disabled')
    }

    if (currentPage < _.size(getChildNodes(dotsWrapper)) - 1) {
        nextBtn.classList.remove('disabled')
    } else {
        nextBtn.classList.add('disabled')
    }

    _.forEach(getChildNodes(dotsWrapper), (dot, index) => {
        if (currentPage === index) {
            dot.classList.add('active')
        } else {
            dot.classList.remove('active')
        }
    })

    const filteredContent = _.filter(getChildNodes(list), (listItem) =>
        list.dataset.filterCurrent === 'all' ? listItem : listItem.dataset.filter === list.dataset.filterCurrent
    )

    const start = MAXIMUM_ITEM_PER_PAGE * currentPage
    const end = start + MAXIMUM_ITEM_PER_PAGE

    _.forEach(filteredContent, (item, index) => {
        if (index >= start && index < end) {
            item.classList.remove('hidden')
        } else {
            item.classList.add('hidden')
        }
    })

    scrollToTop && list.parentNode.parentNode.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    scrollToTop && AOS.refresh()

    updateReportCounter(list)
}

const updateReportList = (list, filter) => {
    list.setAttribute('data-filter-current', filter)

    if (filter === 'all') {
        _.forEach(getChildNodes(list), (item, index) => {
            updateReportPagination(list, 0, false)
            if (isMobileView) {
                item.classList.remove('hidden')
            } else {
                if (index > MAXIMUM_ITEM_PER_PAGE - 1) {
                    item.classList.add('hidden')
                } else {
                    item.classList.remove('hidden')
                }
            }
        })
    } else {
        _.forEach(
            _.filter(getChildNodes(list), (listItem) => {
                updateReportPagination(list, 0, false)
                if (listItem.dataset.filter !== filter) {
                    listItem.classList.add('hidden')
                }
                return listItem.dataset.filter == filter
            }),
            (item, index) => {
                if (isMobileView) {
                    item.classList.remove('hidden')
                } else {
                    if (index > MAXIMUM_ITEM_PER_PAGE - 1) {
                        item.classList.add('hidden')
                    } else {
                        item.classList.remove('hidden')
                    }
                }
            }
        )
    }

    const filteredContent = _.filter(getChildNodes(list), (listItem) => (filter === 'all' ? listItem : listItem.dataset.filter === filter))
    const pageCount = Math.ceil(_.size(filteredContent) / MAXIMUM_ITEM_PER_PAGE)

    const pagination = list?.parentNode?.parentNode?.querySelector('.pagination-desktop')

    if (pagination) {
        const dotsWrapper = pagination.querySelector('.pagination--dots')

        _.forEach(getChildNodes(dotsWrapper), (item) => item.remove())

        _.times(pageCount, (index) => {
            let dot
            if (index == 0) {
                dot = htmlToElement('<div class="active"></div>')
                dotsWrapper.appendChild(dot)
            } else {
                dot = htmlToElement('<div></div>')
                dotsWrapper.appendChild(dot)
            }
        })

        _.forEach(getChildNodes(dotsWrapper), (dot, index) => {
            dot.addEventListener('click', () => {
                updateReportPagination(list, index)
            })
        })

        if (isMobileView) {
            pagination.classList.remove('ready')
        } else {
            if (pageCount > 1) {
                pagination.classList.add('ready')
            } else {
                pagination.classList.remove('ready')
            }
        }
    }
    let requestUpdatePagination = new Event('requestUpdatePagination')
    document.dispatchEvent(requestUpdatePagination)
    setTimeout(() => {
        __reinitReportFilter()
    }, 250)
}

const __reinitReportFilter = () => {
    const lists = document.querySelectorAll('.report-thumbnail-list')
    _.forEach(lists, (list) => {
        const filter = list.dataset.filterId
        if (filter) {
            const filterWrapper = document.querySelector(`[data-filter-selector=${list.dataset.filterId}]`)
            const filterSelector = filterWrapper.querySelector('.custom-dropdown__options')

            _.forEach(getChildNodes(filterSelector), (filterItem) => {
                let currentFilterItem = filterItem
                const newFilterItem = currentFilterItem.cloneNode(true)
                currentFilterItem.parentNode.insertBefore(newFilterItem, currentFilterItem)
                currentFilterItem.remove()
            })

            _.forEach(getChildNodes(filterSelector), (filterItem) => {
                filterItem.addEventListener('click', () => {
                    updateReportList(list, filterItem.dataset.optionValue)
                })
            })
            list.scrollTo({ left: 0 })
            document.dispatchEvent(onReportFilterChanged)
            _.forEach(getChildNodes(list), (item, index) => {
                item.classList.remove('active')
                if (index === 0) {
                    item.classList.add('active')
                }
            })

            const mobilePagination = list.parentNode.parentNode.querySelector('.pagination.pagination--mobile-only')
            const backBtn = mobilePagination.querySelector('.pagination__back-btn')
            const nextBtn = mobilePagination.querySelector('.pagination__next-btn')

            backBtn.classList.add('disabled')
            if (_.size(_.filter(getChildNodes(list), (item) => !item.classList.contains('hidden'))) <= 1) {
                nextBtn.classList.add('disabled')
            } else {
                nextBtn.classList.remove('disabled')
            }
        }

        const oldPagination = list.parentNode.parentNode.querySelector('.pagination-desktop')

        const pagination = oldPagination.cloneNode(true)
        oldPagination.parentNode.insertBefore(pagination, oldPagination)
        oldPagination.remove()

        const dotsWrapper = pagination.querySelector('.pagination--dots')

        const backBtn = pagination.querySelector('.pagination__back-btn')
        const nextBtn = pagination.querySelector('.pagination__next-btn')

        backBtn.classList.add('disabled')

        backBtn.addEventListener('click', () => {
            updateReportPagination(list, Number(list.dataset.paginationCurrent) - 1)
        })

        nextBtn.addEventListener('click', () => {
            updateReportPagination(list, Number(list.dataset.paginationCurrent) + 1)
        })

        _.forEach(getChildNodes(dotsWrapper), (dot, index) => {
            dot.addEventListener('click', () => {
                updateReportPagination(list, index)
            })
        })

        const filteredContent = _.filter(getChildNodes(list), (listItem) =>
            list.dataset.filterCurrent === 'all' ? listItem : listItem.dataset.filter === list.dataset.filterCurrent
        )
        const itemCount = _.size(filteredContent)
        const pageCount = Math.ceil(itemCount / MAXIMUM_ITEM_PER_PAGE)

        if (isMobileView) {
            pagination.classList.remove('ready')
        } else {
            if (pageCount > 1) {
                pagination.classList.add('ready')
            } else {
                pagination.classList.remove('ready')
            }
        }

        updateReportCounter(list)
    })
}

const __initReportList = () => {
    const lists = document.querySelectorAll('.report-thumbnail-list')
    _.forEach(lists, (list) => {
        const itemCount = _.size(getChildNodes(list))
        const pageCount = Math.ceil(itemCount / MAXIMUM_ITEM_PER_PAGE)
        const filter = list.dataset.filterId

        const counterEl = list.parentNode.parentNode.querySelector('.counter')
        counterEl.innerHTML = getCounterText(1, itemCount < MAXIMUM_ITEM_PER_PAGE ? itemCount : MAXIMUM_ITEM_PER_PAGE, itemCount)

        list.setAttribute('data-pagination-current', '0')

        const filterList = []

        _.forEach(getChildNodes(list), (listItem, index) => {
            if (!isMobileView) {
                if (index > MAXIMUM_ITEM_PER_PAGE - 1) {
                    listItem.classList.add('hidden')
                }
            } else {
                listItem.classList.remove('hidden')
            }

            if (listItem.dataset.filter && !_.includes(filterList, listItem.dataset.filter)) {
                filterList.push(listItem.dataset.filter)
                const filterWrapper = document.querySelector(`[data-filter-selector=${list.dataset.filterId}]`)
                const filterSelector = filterWrapper.querySelector('.custom-dropdown__options')

                filterSelector.appendChild(
                    htmlToElement(
                        `
                        <div class="custom-dropdown__item" data-option-value="${listItem.dataset.filter}" data-option-name="${listItem.dataset.filter}">
                        ${listItem.dataset.filter}<img src="/etc.clientlibs/onebangkok/clientlibs/clientlib-base/resources/images/icons/icons-checked.svg" />
                        </div>
                        `
                    )
                )
            }
        })

        if (filter) {
            const filterWrapper = document.querySelector(`[data-filter-selector=${list.dataset.filterId}]`)
            const filterSelector = filterWrapper.querySelector('.custom-dropdown__options')

            _.forEach(getChildNodes(filterSelector), (filterItem) => {
                filterItem.addEventListener('click', () => {
                    updateReportList(list, filterItem.dataset.optionValue)
                })
            })
        }

        const pagination = list.parentNode.parentNode.querySelector('.pagination-desktop')

        const dotsWrapper = pagination.querySelector('.pagination--dots')

        const backBtn = pagination.querySelector('.pagination__back-btn')
        const nextBtn = pagination.querySelector('.pagination__next-btn')

        backBtn.classList.add('disabled')

        backBtn.addEventListener('click', () => {
            updateReportPagination(list, Number(list.dataset.paginationCurrent) - 1)
        })

        nextBtn.addEventListener('click', () => {
            updateReportPagination(list, Number(list.dataset.paginationCurrent) + 1)
        })

        if (!isMobileView) {
            _.times(pageCount, (index) => {
                let dot
                if (index == 0) {
                    dot = htmlToElement('<div class="active"></div>')
                    dotsWrapper.appendChild(dot)
                } else {
                    dot = htmlToElement('<div></div>')
                    dotsWrapper.appendChild(dot)
                }
            })
        }

        _.forEach(getChildNodes(dotsWrapper), (dot, index) => {
            dot.addEventListener('click', () => {
                updateReportPagination(list, index)
            })
        })

        if (isMobileView) {
            pagination.classList.remove('ready')
        } else {
            if (pageCount > 1) {
                pagination.classList.add('ready')
            } else {
                pagination.classList.remove('ready')
            }
        }
    })
    let requestUpdatePagination = new Event('requestUpdatePagination')
    document.dispatchEvent(requestUpdatePagination)
    document.dispatchEvent(onReportFilterChanged)
}
;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            __initReportList()
            console.log('Init content listing report script imported')
        }
    }, 100)
})()
