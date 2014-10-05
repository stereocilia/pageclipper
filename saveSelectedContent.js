/**
 * File: saveSelectedContent.js
 *
 *
 */

function uuid() {
    var buf = new Uint16Array(8);
    window.crypto.getRandomValues(buf);
    var S4 = function(num) {
        var ret = num.toString(16);
        while(ret.length < 4){
            ret = "0"+ret;
        }
        return ret;
    };
    return (S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7]));
}

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
        'url': window.location.href,
        'uuid':uuid()
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
}

function saveClipToLocalStorage(){
  //request the clips in storage
  chrome.storage.local.get('clips', doneGettingClips);
}

saveClipToLocalStorage();