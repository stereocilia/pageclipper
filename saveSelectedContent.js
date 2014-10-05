/**
 * File: saveSelectedContent.js
 *
 *
 */


//clean the HTML up, such as giving links their full paths, or making
//psuedo links into plain text
function cleanHTML(html){
  return html;
}


//make a clip object from the page selection
function getClipFromPage(){
  var clip = {'url':'','html':''};
  if (window.getSelection) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
      var range = selection.getRangeAt(0);
      var clonedSelection = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(clonedSelection);
      clip = {
        "html": cleanHTML(div.innerHTML), 
        'url': window.location.href
      };
    }
  }
  return clip;
}

function doneSavingClips(){
  console.log('Settings saved');
}

function doneGettingClips(loadedData){
  if(!loadedData.clips){
    loadedData.clips = [];
  }
  var clip = getClipFromPage();
  loadedData.clips.push(clip);
  chrome.storage.local.set(loadedData, doneSavingClips);
  console.log(loadedData.clips);
}

function saveClipToLocalStorage(){
  //request the clips in storage
  chrome.storage.local.get('clips', doneGettingClips);
}

saveClipToLocalStorage();