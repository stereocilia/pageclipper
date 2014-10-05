/**
 * File: popup.js
 *
 *
 */

function renderClips(clips){
  var mainContainer = document.getElementById('mainContainer');
  //clear content
  while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
  }
  for(var i=0;i<clips.length;i++){
    var div = document.createElement('div');
    div.innerHTML = clips[i].html;
    mainContainer.appendChild(div);
  }
}

function doneGettingClips(loadedData){
  if(loadedData.clips){
    console.log('found clips');
    renderClips(loadedData.clips);
  } else {
    console.log(loadedData);
  }
}

function getClipsFromLocalStorage(){
  console.log('getting clips')
  chrome.storage.local.get('clips', doneGettingClips);
}

getClipsFromLocalStorage();