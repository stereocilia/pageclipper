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
/**
 * Browser Button Clicked
 * 
 * Injects css
 */
chrome.browserAction.onClicked.addListener(function(tab) {
  //if a current tab does not exist
  var urlPopup = chrome.extension.getURL("popup.html");
  chrome.tabs.query({url:urlPopup}, function(tabsFounds){
    if(tabsFounds.length === 0){	//no tabs for our extension are open
      chrome.tabs.create({
	url:urlPopup,
	index:tab.index	//replace the tab's position with the new tab
      });
    } else {
      //focus the tab for our extension
      chrome.tabs.highlight({
	tabs:tabsFounds[0].index,
	windowId:tabsFounds[0].windowId
      }, function(){});
    }
  });
  
  //chrome.tabs.executeScript(null, {file: "popup.js"});
  //chrome.tabs.insertCSS(null, {file: "popup.css"});
});