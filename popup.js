/**
 * File: popup.js
 *
 * Code for popup.html
 *
 * Loads clips from local storage, renders them as HTML, 
 * binds UI functionality, saves changes back to storage.
 *
 */

 //
 // GLOBALS
 //

/**
 * _loadedClips
 *
 * in memory clips loaded from local storage
 *
 * @type {Array}
 */
var _loadedClips = [];

/**
 * _clipsIdMap
 *
 * map clip uuid to index in _loadedClips global
 *
 * @type {PlainObject}
 */
var _clipsIdMap = {};

//
// HELPERS
//

/**
 * registerClips
 *
 * Save the clips array in memory and map each 
 * uuid to its index in that array.
 *
 */
function registerClips(clips){
  _loadedClips = clips;
  _clipsIdMap = {};       //reset the in memory map

  for(var i=0;i<_loadedClips.length;i++){
    _clipsIdMap[_loadedClips[i].uuid] = i;
  }
  
}

//
// CONTROL HANDLERS
//
function handleRemoveClick(e){
  var uuid = e.target.getAttribute('data-storeid');
  var clipIndex = _clipsIdMap[uuid];
  _loadedClips.splice(clipIndex, 1);
  chrome.storage.local.set({'clips':_loadedClips});
}
function handleMoveupClick(e){
  //we don't check for valid indexes because only clips that can be moved have a 'move up' link
  var uuid = e.target.getAttribute('data-storeid');
  var clipIndex = _clipsIdMap[uuid];
  var removedClip = _loadedClips.splice(clipIndex, 1);
  _loadedClips.splice(clipIndex-1, 0, removedClip[0]);
  chrome.storage.local.set({'clips':_loadedClips});
}

//
// RENDER
//

function renderClips(clips){
  var mainContainer = document.getElementById('mainContainer');
  //clear content
  while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
  }
  for(var i=0;i<clips.length;i++){
    //main container
    var div = document.createElement('div');
    div.setAttribute('class', 'clip');
    //meta wrapper
    var divMeta = document.createElement('div');
    divMeta.setAttribute('class', 'meta info');
    divMeta.innerHTML = '<small>Clipped from</small><br><small><a target="_blank" href="' + clips[i].url + '">' + clips[i].url + '</a></small>';
    //controls wrapper
    var divControls = document.createElement('div');
    divControls.setAttribute('class', 'controlContainer');
    //move up link
    var moveUpLink;
    if(clips.length > 1 && i > 0){
      var moveUpLink = document.createElement('a');
      moveUpLink.setAttribute('class', 'control moveup link');
      moveUpLink.setAttribute('data-storeid', clips[i].uuid);
      moveUpLink.innerHTML = '[^] move up';      
    }

    //delete link
    var deleteLink = document.createElement('a');
    deleteLink.setAttribute('class', 'control remove link');
    deleteLink.setAttribute('data-storeid', clips[i].uuid);
    deleteLink.innerHTML = '[x] remove';
    //appendings
    if(moveUpLink) divControls.appendChild(moveUpLink);
    divControls.appendChild(deleteLink);
    div.appendChild(divControls); 
    div.appendChild(divMeta); 
    div.innerHTML += clips[i].html;
    mainContainer.appendChild(div);
  }
  //bind control events
  //bind move up links
  var documentMoveupLinks = document.querySelectorAll('.control.moveup');
  for(i=0;i<documentMoveupLinks.length;i++) {
    documentMoveupLinks[i].addEventListener('click', handleMoveupClick);
  }
  //bind delete links
  var documentDeleteLinks = document.querySelectorAll('.control.remove');
  for(i=0;i<documentDeleteLinks.length;i++) {
    documentDeleteLinks[i].addEventListener('click', handleRemoveClick);
  }
  //show or hide the no clips message
  var msgNoClips = document.querySelector('.msg.noclips');
  var msgNoClipsStyle = '';
  if(clips.length < 1) msgNoClipsStyle = 'display:block;';
  msgNoClips.setAttribute('style', msgNoClipsStyle);
}

//
// STORAGE
//

function loadClips(loadedData){
  registerClips(loadedData.clips);
  renderClips(loadedData.clips);
}
function loadClipsFromLocalStorage(){
  chrome.storage.local.get('clips', loadClips);
}
function handleStorageChanged(changes, areaName){
  if(areaName === 'local' && changes.clips) loadClips({'clips':changes.clips.newValue});
}

//
// INIT
//

function initialize(){
  chrome.storage.onChanged.addListener(handleStorageChanged);
  loadClipsFromLocalStorage();  
}

//
// RUN
//

document.addEventListener('DOMContentLoaded', initialize);