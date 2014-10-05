//inject script into page and pull out DOM Elements
function handleContextMenuClick(info, tab){
  chrome.tabs.executeScript(null, {file: "saveSelectedContent.js"});
}
//add persitent functionality during installation
function handleInstall(){
  var context = "selection";
  var title = "Clip this...";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});   
}
function handleStorageChanged(changes, areaName){
  if(changes.clips){
    //launch the pop up and tell it to refresh itself from local storage.
    //chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    //});
  }
}

//
// BIND
//

// Installation event
chrome.runtime.onInstalled.addListener(handleInstall);

// our right click menu entry clicked
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

// Storage changed (save) event
chrome.storage.onChanged.addListener(handleStorageChanged);
/*chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    console.log(sender);

    //TODO: Save request in indexeddb
    //sendResponse({farewell: "goodbye"});
  });
*/
/*
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "pullContentFromPage.js"});
});
*/