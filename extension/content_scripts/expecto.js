
console.log("Content script running...");
(function() {
    /**
     * Check and set a global guard variable
     * This prevents the script from executing twice on the same page
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    // browser namespace depending on browser
    // chrome for Chrome OR browser for Firefox
    browser = (function() { return chrome || browser; })();

    /**
     * These will be populated with data received from the popup
     */
    let urlTitle = null;
    let interval = 3000;
    // let iconURL = "";
    let intervalId = null;

    const SUBTITLE_HISTORY_LIMIT = 200;            // Size of the history string
    // let SUBTITLE_CONTAINER_CLASS = "iTTPOb VbkSUe"; // Container classname
    // let SUBTITLE_SPAN_CLASS = "CNusmb";             // Subtitles are stored as spans
    let subs = "";  
    let old_subs_rep ="";                                // Global subtitles seen so far
    // let subtitle_scan_location = 0;                 // Last processed subtitle location
		
    /**
     * @function notify
     * Wrapper method that creates a new notification object or requests permissions
     * to do so if it's disabled. Throws an error if the browser doesn't support extensions
     * This is the example script found on MDN
     */
    function notify(notifBody) {
        // Let's check if the browser supports notifications
        alert(notifBody)
    }

    // async function analyseVoice() {
    //     let new_subs = subs.slice(subtitle_scan_location);
    //     subtitle_scan_location = subs.length;
    //     console.log(new_subs)
    //     for( word of new_subs.split(' ') ) {
    //         if( keywords.includes(word.replace(/[^\w\s]|_/g,"").trim().toLowerCase()) ){
    //             notify(word);
    //         }
    //     }
    //     const response = await fetch('https://www.example.com/greeting.json');
    //     console.log(response.statusText);

    // }
    /**
     * @function storeSubtitle
     * When called, this function scans through the current state of the subtitles
     * and fires a notification if any of the words match those mentioned in the
     * keywords array
     */
    async function storeSubtitle(subtitle) {
        // let new_subs = subs.slice(subtitle_scan_location);
        const url = 'http://127.0.0.1:5000';
        const data = { 
            urlTitle :urlTitle,
            subtitle: subtitle
        };

        const jsonData = JSON.stringify(data);

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        fetch(url, {
        method: 'POST', 
        headers: headers,
        body: jsonData
        })
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
        })
        .then(responseData => {
        console.log(responseData);  
        })
        .catch(error => {
        console.error('Error:', error);
        });


    }
    /**
     * @function updateSubtitle
     * The function updates the global subtitle stream with the latest stable updates
     * from the subtitle textblock on gmeet
     */
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }
            
    function updateSubtitle() {
            console.log('Updating subtitle');
            // let new_subs = document.getElementsByClassName(SUBTITLE_CONTAINER_CLASS)[0]
            let new_subs = getElementByXpath("/html/body/div[1]/c-wiz/div[1]/div/div[33]/div[3]/div[3]/div/div[2]/div[1]")

            if (new_subs === undefined) return;
            else new_subs = new_subs.innerText;

            let old_subs_preview = subs.slice(-SUBTITLE_HISTORY_LIMIT);
            let new_subs_preview = new_subs.slice(0, Math.min(10, old_subs_preview.length));

            let match_point = old_subs_preview.match(new_subs_preview);
            let match_point_api = new_subs_preview.match(old_subs_rep.slice(-Math.min(20,old_subs_rep.length)))
            if (match_point_api > 0 ) return;
                

            if (match_point === null) {
                subs = subs.concat(new_subs);
            } else {
                match_point = match_point.index;
                old_subs_preview = old_subs_preview.slice(0,match_point);
                old_subs_preview += new_subs;
                subs = subs.slice(0, -SUBTITLE_HISTORY_LIMIT);
                subs = subs.concat(old_subs_preview);
            }
    }
    /**
     * @function pruneSubs
     * Removes subtitle history that has already been processed
     * Keeps only the most recent 1000 (+50) characters
     * The 50 charaters are a buffer against words that might not have
     * been completely processed.
     */
    function pruneSubs() {
        console.log(subs.length);
        console.log("check")
        if (subs.length > SUBTITLE_HISTORY_LIMIT) {
            console.log("subs before")
            console.log(subs)
            subtitle = subs
            old_subs_rep = subs.slice(SUBTITLE_HISTORY_LIMIT - 10);
            subs=""
            storeSubtitle(subtitle)
            console.log("subs after")

        }
    }

    browser.runtime.onMessage.addListener((message) => {
        if( message.command === "toggle" ) {
            console.log("Toggle successfull");
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
                notify("I'll stop recording now")
            }
            else {
                intervalId = setInterval(()=> {
                    updateSubtitle();
                    pruneSubs();
                }, interval);
                notify("I'll start recording you now")
            }
            browser.runtime.sendMessage({
                command: "setToggle",
                activated: intervalId!=null,
            })
        }
        else if(message.command === "setUrl"){
            tab = message.tabs[0];
            if (tab.url.match('meet.google.com') != null) {
                urlTitle = tab.title;
            }
            console.log("Setting title url")
        }
    })
})();
