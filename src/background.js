
console.log('HomeFinder: Extension installed!');

if (typeof browser === "undefined") {
    var browser = chrome;
}

const portCollection = {};
const messageQueue = {};

// Listen for connection requests from content scripts
browser.runtime.onConnect.addListener((port) => {
    if (port.name === "content-script-port") {
        const tabId = port.sender.tab.id;
        portCollection[tabId] = port;
        if (tabId in messageQueue)
        {
            portCollection[tabId].postMessage({ data: messageQueue[tabId] });
            delete messageQueue[tabId];
        }
    }
    port.onDisconnect.addListener((port) => {
        if (port.name === "content-script-port") {
            const tabId = port.sender.tab.id;
            delete portCollection[tabId];
        }
    });
});


const filter = {
    url:
    [
        {urlMatches : "^[^:]*:(?://)?(?:[^/]*\\.)?facebook\\.com/.*$"}
    ]
}

function logOnHistoryStateUpdated(details) {
    if (details.tabId in portCollection)
    {
        portCollection[details.tabId].postMessage({ data: details.url });
    }
    else
    {
        messageQueue[details.tabId] = details.url;
    }
}

browser.webNavigation.onHistoryStateUpdated.addListener(logOnHistoryStateUpdated, filter);