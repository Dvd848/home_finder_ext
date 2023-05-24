if (typeof browser === "undefined") {
    var browser = chrome;
}


function hasHebrewText(elem) {
    const hebrewRegex = /[\u0590-\u05FF₪]/;
    
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
        case "172544843294":
        case "395319067196736":
        case "33617050741":
        case "116786231716844":
        case "569703969718225":
        case "490648764287205":
        case "325992450444":
        case "339785562769443":
        case "269095706451130":
        case "196899563717374":
        case "464476390293839":
        case "131484570239983":
        case "1434344440126857":
        case "135890019940489":
        case "127155277335420":
        case "405108889539214":
        case "108387882545483":
        case "831198626893042":
        case "124688444222407":
        case "1387264628220377":
        case "163590497107024":
        case "634295719957756":
        case "50888440649":
        case "121562707980013":
        case "451335978276267":
        case "386859651353289":
        case "344780799040537":
            return prepareCityDataParsed(cityData["jer"]);
        case "377520242307572":
        case "174573269222997":
        case "143301732366315":
        case "337897736291745":
        case "161493114049301":
        case "204509792523":
        case "173351201739":
        case "227109177413846":
        case "335593376567613":
        case "601652356552446":
        case "293746787396757":
        case "570905303053795":
        case "302498687310251":
            return prepareCityDataParsed(cityData["hf"]);
        case "1422040104674708":
        case "301573709936327":
        case "239734636143988":
        case "151292078248577":
        case "232218806803833":
        case "147637378748874":
        case "493733584036609":
        case "138595033004411":
        case "279135451973":
        case "205317886171313":
        case "196524600428443":
        case "170744879507":
        case "142572615816414":
        case "130592653688128":
        case "207290626061815":
        case "554804064546165":
        case "415658475153353":
        case "142340452512677":
        case "564730503572023":
        case "526817150689303":
        case "193880240769163":
        case "562920413746648":
        case "1488789531356328":
        case "683706645030368":
        case "227042837307326":
        case "145584955637037":
        case "126586377435817":
        case "196529610469261":
        case "549154868454282":
        case "171816232983579":
        case "864908790226104":
        case "577213079062510":
            return prepareCityDataParsed(cityData["bs"]);
        case "435333683167963":
        case "523784051160523":
        case "611221532231146":
        case "618916788287378":
        case "1180930655253418":
        case "1271843679561193":
        case "1444374652537894":
        case "1478799402337716":
        case "1551732165041305":
        case "1822631351291962":
            return prepareCityDataParsed(cityData["md"]);
        case "545381338821054":
        case "210017329078876":
        case "247322211969950":
        case "191591524188001":
        case "425159980963199":
        case "596144497072839":
        case "45245752193":
        case "36672129795":
        case "35819517694":
        case "251913861578098":
        case "483663788332307":
        case "336341926432244":
        case "334727325275":
        case "139400782914590":
        case "184540851716964":
        case "295395253832427":
        case "391306014262850":
        case "415156081922959":
        case "1394448324105253":
        case "503525946346109":
        case "756108794454998":
        case "1479898515574455":
        case "667240973292009":
        case "669416286472309":
        case "1418386708398199":
        case "161162324086838":
        case "665278950172707":
        case "169173939929980":
        case "474274356013216":
        case "1427929940815001":
        case "119724484721768":
        case "307455682721884":
        case "319568031393654":
        case "188430365379":
        case "305724686290054":
            return prepareCityDataParsed(cityData["ta"]);
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