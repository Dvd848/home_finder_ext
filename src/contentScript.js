if (typeof browser === "undefined") {
    var browser = chrome;
}


function hasHebrewText(elem) {
    const hebrewRegex = /[\u0590-\u05FF]/;
    
    for (const node of elem.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (hebrewRegex.test(node.textContent)) {
                return true;
            }
        }
    }
    
    return false;
}

function isRecentChildOfLink(element) {
    let parent = element.parentNode;
    let count = 0;
    
    while (parent && count < 5) {
        if (parent.getAttribute('role') === 'link') {
            return true;
        }
        
        parent = parent.parentNode;
        count++;
    }
    
    return false;
}

function seeMore(postElement) {    
    const childDivs = postElement.querySelectorAll("div[role='button']");
    for (const div of childDivs) {
        if (div.textContent.trim() === 'See more') {
            div.click();
            break;
        }
    }
}

function enhanceElement(cityData, element) {
    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            const replacementNode = document.createElement('span');
            replacementNode.innerHTML = replaceKeywords(cityData, node.textContent);
            node.parentNode.insertBefore(replacementNode, node);
            node.parentNode.removeChild(node);
        }
    }
}

function extractGroupNameFromUrl(url) {
    const regex = /\/groups\/([^/]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

function handlePost(cityData, postElement) {
    seeMore(postElement);

    const classMarker = "HomeFinderClass";
    if (postElement.classList.contains(classMarker)) {
        //console.log("HomeFinder: Element parsed more than once", postElement);
        return;
    }

    postElement.classList.add(classMarker);
    
    setTimeout(() => {
        const contentChildren = postElement.querySelectorAll('div,h4,span,b,i');
        
        for (const elem of contentChildren) {
            if (hasHebrewText(elem) && !isRecentChildOfLink(elem)) {
                enhanceElement(cityData, elem);
            }
        }
    }, 200);
    
}

const targetNodeTracker = {};

function attachToTarget(targetNode, data) {
    if (targetNode in targetNodeTracker)
    {
        //console.log("Already tracked", targetNode)
        targetNodeTracker[targetNode].disconnect();
    }
    
    for (const child of targetNode.children) { 
        handlePost(data, child);
    }

    const date = new Date().getTime();
    
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type != "childList") {
                continue;
            }
            
            for (const addedElement of mutation.addedNodes)
            {
                if (addedElement.parentNode !== targetNode)
                {
                    continue;
                }
                //console.log(date, addedElement, targetNode);
                handlePost(data, addedElement);
            }
        }
    };
    
    const observer = new MutationObserver(callback);
    targetNodeTracker[targetNode] = observer;
    
    targetNodeTracker[targetNode].observe(targetNode, { attributes: true, childList: true, subtree: true, characterData : true });
    console.log("HomeFinder: Attached to", targetNode);
}


function getCityData() {
    const groupName = extractGroupNameFromUrl(window.location.href);
    switch (groupName) {
        case "344780799040537":
            return prepareCityDataParsed(cityData["jer"]);
        case "570905303053795":
            return prepareCityDataParsed(cityData["hf"]);
        default:
            return null;
    }
}

function init(target) {
    const cityData = getCityData();
    if (cityData == null)
    {
        return;
    }

    if (target !== null) {
        attachToTarget(target, cityData);
    } else {
        console.log("Can't find feed, assuming single post");
        setTimeout(() => {
            const articleNode = document.querySelector("div[role='article']");
            if (articleNode != null) {
                handlePost(cityData, articleNode);
            }
        }, 2000);
    }

}

init(document.querySelector("div[role='feed']"));

const mainObserver = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type != "childList") {
            continue;
        }
        
        for (const addedElement of mutation.addedNodes) {
            if (typeof addedElement.querySelectorAll !== 'function') {
                continue;
            }

            const feeds = addedElement.querySelectorAll("div[role='feed']");
            if (feeds.length == 1) {
                init(feeds[0]);
            }
            else if (feeds.length > 1) {
                console.log("HomeFinder: Found multiple feeds: ", feeds);
            }
        }
    }
}).observe(document.body, { attributes: false, childList: true, subtree: true });

const port = browser.runtime.connect({ name: "content-script-port" });

port.onMessage.addListener((message) => {
    // Handle messages received from the background page
    setTimeout(() => {
        console.log("HomeFinder: Trigger received from background page", document.querySelectorAll("div[role='feed']"));
        document.querySelectorAll("div[role='feed']").forEach((elem) => {
            init(elem);
        })
    }, 2000);
});