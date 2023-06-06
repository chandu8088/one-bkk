;(function () {
    let stateCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(stateCheck)
            // run()
            console.log('Overriding script imported')
        }
    }, 100)
})()
