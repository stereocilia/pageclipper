/**
 * File: popup.js
 *
 * Code for popup.html
 *
 * Loads clips from local storage, renders them as HTML, 
 * binds UI functionality, saves changes back to storage.
 *
 */
(function(){


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
function saveClipsToLocalStorage(callback){
  callback = callback || function(){};
  chrome.storage.local.set({'clips':_loadedClips}, callback);
}

//
// CONTROL HANDLERS
//
function handleRemoveClick(e){
  var uuid = e.target.getAttribute('data-storeid');
  var clipIndex = _clipsIdMap[uuid];
  _loadedClips.splice(clipIndex, 1);
  saveClipsToLocalStorage();
  //chrome.storage.local.set({'clips':_loadedClips});
}
function handleMoveupClick(e){
  //we don't check for valid indexes because only clips that can be moved have a 'move up' link
  var uuid = e.target.getAttribute('data-storeid');
  var clipIndex = _clipsIdMap[uuid];
  var removedClip = _loadedClips.splice(clipIndex, 1);
  _loadedClips.splice(clipIndex-1, 0, removedClip[0]);
  saveClipsToLocalStorage();
}
function handleContentChanged(e){
  var uuid = e.target.getAttribute('data-storeid');
  var newContent = e.target.innerHTML;
  var clipIndex = _clipsIdMap[uuid];
  if(_loadedClips[clipIndex].html !== newContent){
    _loadedClips[clipIndex].html = newContent;
    saveClipsToLocalStorage();
  }
}

//
// RENDER
//

var MOUSEDOWN = false;
var anchorx = 0;
var anchory = 0;
var mouseanchorx = 0;
var mouseanchory = 0;
var moveElement = null;
window.mainContainerX = window.mainContainerX || 30;
window.mainContainerY = window.mainContainerY || 30;

function handleMousemove(e){
  //use the current mouse position
  var distancex = (e.x - mouseanchorx);
  var distancey = (e.y - mouseanchory);
  window.mainContainerX = (anchorx + distancex);
  window.mainContainerY = (anchory + distancey);
  moveElement.style.left = window.mainContainerX.toString() + 'px';
  moveElement.style.top = window.mainContainerY.toString() + 'px';
  //console.log('posx: ' + (anchorx + distancex).toString() + 'px' + ', posy: ' + (anchory + distancey).toString() + 'px');
  //console.log('distancex: ' + distancex.toString());
  //console.log('distancey: ' + distancey.toString());
}

function bindMousemoveToBody(e){
  MOUSEDOWN = true;
  document.body.addEventListener('mousemove', handleMousemove);
  anchorx = e.target.offsetLeft;
  anchory = e.target.offsetTop;
  mouseanchorx = e.x;
  mouseanchory = e.y;
  moveElement = e.target;
}
function bindMouseupToBody(){
  document.body.addEventListener('mouseup', handleMainContainerMouseup);
}
function unbindMouseupFromBody(){
  document.body.removeEventListener('mouseup', handleMainContainerMouseup);
}
function unbindMousemoveFromBody(e){
      MOUSEDOWN = false;
      document.body.removeEventListener('mousemove', handleMousemove);
      anchorx = 0;
      anchory = 0;
      mouseanchorx = 0;
      mouseanchory = 0;
      moveElement = null;
}
function handleMainContainerMousedown(e){
  //e.preventDefault();
  bindMousemoveToBody(e);
  bindMouseupToBody();
}
function handleMainContainerMouseup(e){
  //e.preventDefault();
  unbindMousemoveFromBody(e);
  unbindMouseupFromBody();
}
function renderClips(clips){
  var mainContainer = document.getElementById('mainContainer');
  if(!mainContainer){
    mainContainer = document.createElement('div');
    mainContainer.setAttribute('id', 'mainContainer');
    mainContainer.setAttribute('class', '_pageclipper_popup');
    document.body.appendChild(mainContainer);
    mainContainer.addEventListener('mousedown', handleMainContainerMousedown);
    //mainContainer.addEventListener('mouseup', handleMainContainerMouseup);
  }
  //clear content
  while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
  }
  mainContainer.innerHTML = '<h1 style="float:right;cursor:default;">Page Clips</h1><br style="clear:both;">';
  mainContainer.firstChild.addEventListener('mousedown', function(e){e.preventDefault();});
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
    //content wrapper
    var divContent = document.createElement('div');
    divContent.setAttribute('class', 'content');
    divContent.setAttribute('data-storeid', clips[i].uuid);
    //TODO: Make dynamically editable with button
    //divContent.setAttribute('contenteditable', 'true');
    divContent.innerHTML = clips[i].html;
    //appendings
    if(moveUpLink) divControls.appendChild(moveUpLink);
    divControls.appendChild(deleteLink);
    div.appendChild(divControls); 
    div.appendChild(divMeta); 
    div.appendChild(divContent); 
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
  //handleContentChanged
  //bind editable content
  var documentEditableContent = document.querySelectorAll('.content');
  for(i=0;i<documentEditableContent.length;i++) {
    documentEditableContent[i].addEventListener('blur', handleContentChanged);
  }

  if(clips.length < 1){
    mainContainer.innerHTML = '<p style="text-align:center;font-weight:bold;">You have no clips</p>';
  }
  //show or hide the no clips message
  //var msgNoClips = document.querySelector('.msg.noclips');
  //var msgNoClipsStyle = '';
  //if(clips.length < 1) msgNoClipsStyle = 'display:block;';
  //msgNoClips.setAttribute('style', msgNoClipsStyle);
}

//
// STORAGE
//

function loadClips(loadedData){
  loadedData.clips = loadedData.clips || []; 
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
  var mainContainer = document.getElementById('mainContainer');
  if(mainContainer){
    var mainContainerStyle = mainContainer.getAttribute('style');
    if(mainContainerStyle && mainContainerStyle === 'display:none;'){
      mainContainer.setAttribute('style', 'left:' + window.mainContainerX.toString() + 'px;top:' + window.mainContainerY.toString() + 'px;');
    } else {
      mainContainer.setAttribute('style', 'display:none;');
      return 0;
    }
  }
  chrome.storage.onChanged.addListener(handleStorageChanged);
  loadClipsFromLocalStorage();  
}

//
// RUN
//

initialize();

//document.addEventListener('DOMContentLoaded', initialize);

})();