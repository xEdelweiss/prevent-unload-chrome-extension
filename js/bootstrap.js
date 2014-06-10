var previousHandler = function(){};

chrome.tabs.onUpdated.addListener(function(id, info, tab){
    chrome.pageAction.show(tab.id);

    if (!localStorage['preventUnloadList']) {
        localStorage['preventUnloadList'] = new Array();
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {

    var blocked;
    chrome.storage.sync.get('preventUnloadList', function(result){
        blocked = result.preventUnloadList;
    });

    if (!blocked[tab.id]){
        // deny

        chrome.tabs.executeScript({
            code: 'window.onbeforeunload = function(){return "Unload?"};'
        });

        chrome.pageAction.setIcon({tabId: tab.id, path: 'res/icon32-deny.png'});
        blocked[tab.id] = true;
    } else {
        // allow
        chrome.pageAction.setIcon({tabId: tab.id, path: 'res/icon32-allow.png'});
        blocked[tab.id] = false;
    }

    chrome.storage.sync.set({preventUnloadList: blocked});

    chrome.tabs.executeScript({
        code: 'console.warn('+JSON.stringify(blocked)+');'
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    var blocked;
    chrome.storage.sync.get('preventUnloadList', function(result){
        blocked = result.preventUnloadList;
    });

//    var icon = localStorage['preventUnloadList'][tab.id] ? 'res/icon32-deny.png' : 'res/icon32-allow.png';
//    chrome.pageAction.setIcon({tabId: tab.id, path: icon});
//
//    if (localStorage['preventUnloadList'][tab.id]) {
//        chrome.tabs.executeScript({
//            code: 'window.onbeforeunload = function(){return "Unload?"};'
//        });
//    }

    chrome.tabs.executeScript({
        code: 'console.warn('+JSON.stringify(blocked)+');'
    });
});