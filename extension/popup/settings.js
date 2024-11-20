(function listenForClicks() {

    // browser namespace depending on browser
    // chrome for Chrome OR browser for Firefox
    browser = (function() { return  chrome || browser; })();
    console.log("RUNNING")
    let urlTitle = null;

    async function callApi() {
        const url = ' http://127.0.0.1:5000/getsubtitle'; // API endpoint
        const data = {
            // Your POST data ???
            urlTitle: urlTitle,
        };
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the response is JSON, handle it and update the UI
            document.getElementById('apiResponse').innerText = data["summary"]
        })
        .catch(error => {
            document.getElementById('apiResponse').innerText = `Error: ${error}`;
        });
    }
    document.getElementById('apiButton').addEventListener('click', async () => {
        await callApi();
    });

    document.addEventListener('click', e => {
        console.log("I got a click! 2");
        function togglePatronus(tabs) {
            console.log(`Toggling`)
            // if tabs is undefined, report error
            if (!tabs) {
                return reportError("tabs undefined")
            }
            
            console.log("Switching Patronus state...")
            browser.tabs.sendMessage(tabs[0].id, {
                command: "toggle"
            })
        }
        function reportError(error) {
            console.error(`Expecto Patronus failed: ${error}`)
        }

        if (e.target.classList.contains("apply")) {
            console.log("Apply button hit")
            browser.tabs.query({active: true, currentWindow: true}, sendProperties)
        }

        else if (e.target.classList.contains("slider")) {
            console.log("Toggle button hit")
            browser.tabs.query({active: true, currentWindow: true}, togglePatronus)
        }

        else {
            console.log(e.target.classList)
        }
    });

    // Show the warning message if we're not on the right tab
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        tab = tabs[0];
        urlTitle = tabs[0].title
        if (tab.url.match('meet.google.com') == null) {
            console.log("Wrong tab")
            document.querySelector('#popup-content').classList.add('hidden')
            document.querySelector('#error-content').classList.remove('hidden')
        }
        else {
            browser.tabs.sendMessage(tab.id, {
                command: "setUrl",
                tabs: tabs
            })
        }
    })


    // Get content-script state
    browser.runtime.onMessage.addListener((message) => {
        if (message.command = "setToggle") {
            // console.log("Received properties")
            // document.getElementById('keywords').value = message.keywords;
            // document.getElementById('interval').value = message.interval;
            document.getElementById('toggle_switch').checked = message.activated;
            // if (message.subtitleState)
            //     document.getElementById('subtitle-warning').classList.add('hidden');
            // else
            //     document.getElementById('subtitle-warning').classList.remove('hidden');
        }
    })
})();