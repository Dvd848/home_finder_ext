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

function enhanceElement(element) {
    for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            const replacementNode = document.createElement('span');
            replacementNode.innerHTML = replaceKeywords(node.textContent);
            node.parentNode.insertBefore(replacementNode, node);
            node.parentNode.removeChild(node);
        }
    }
}

function handlePost(postElement) {
    seeMore(postElement);
    
    setTimeout(() => {
        const contentChildren = postElement.querySelectorAll('div,h4,span,b,i');
        
        for (const elem of contentChildren) {
            if (hasHebrewText(elem) && !isRecentChildOfLink(elem)) {
                enhanceElement(elem);
            }
        }
    }, 200);
    
}

function init() {

    const targetNode = document.querySelector("div[role='feed']");
    if (targetNode == null)
    {
        return false;
    }
    
    for (const child of targetNode.children) { 
        handlePost(child);
    }
        
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
                handlePost(addedElement);
            }
        }
    };
    
    const observer = new MutationObserver(callback);
    
    observer.observe(targetNode, { attributes: false, childList: true, subtree: true });

    return true;
}

if (init() == false)
{
    setTimeout(() => {
        if (init() == false)
        {
            const articleNode = document.querySelector("div[role='article']");
            if (articleNode != null)
            {
                for (const child of articleNode.children) { 
                    handlePost(child);
                }
            }
        }
    }, 2000);
}