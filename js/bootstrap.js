var blocked = [];

function refreshState(tabId){
    if (blocked[tabId]){
        chrome.pageAction.setIcon({tabId: tabId, path: 'res/icon32-deny.png'});
        chrome.pageAction.setTitle({tabId: tabId, title: 'Unload is blocked'});

        chrome.tabs.executeScript({
            code: 'window._previous_onbeforeunload = window.onbeforeunload; window.onbeforeunload = function(){return "Unload?"};'
        });
    } else {
        chrome.pageAction.setIcon({tabId: tabId, path: 'res/icon32-allow.png'});
        chrome.pageAction.setTitle({tabId: tabId, title: 'Unload is allowed'});

        chrome.tabs.executeScript({
            code: 'window.onbeforeunload = window._previous_onbeforeunload ? window._previous_onbeforeunload : function(){};'
        });
    }
}

chrome.tabs.onUpdated.addListener(function(id, info, tab){
    chrome.pageAction.show(tab.id);

    if (!localStorage['preventUnloadList']) {
        localStorage['preventUnloadList'] = new Array();
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    console.info('onClicked', blocked[tab.id]);

    if (!blocked[tab.id]){
        // deny
        blocked[tab.id] = true;
    } else {
        // allow
        blocked[tab.id] = false;
    }

    refreshState(tab.id);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    console.info('onUpdated', blocked[tab.id]);
    refreshState(tab.id);
});