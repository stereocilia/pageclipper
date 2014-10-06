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

function removeInlineCodeFromLinks(){
  //remove any href javascript calls
}

function giveLinksFullUrls(html){
  var div = document.createElement('div');
  div.innerHTML = html;
  var links = div.querySelectorAll('a, img');
  for(var i=0;i<links.length;i++){
    var key = '';
    if(links[i].href) key = 'href';
    else if (links[i].src) key = 'src';

    if(key.length){
      var uri = links[i].getAttribute(key);
      if(key === 'href') {
        links[i].setAttribute('target', '_blank');
      }
      //JAVASCRIPT
      var codeMatch = uri.match(/^javascript\:/);
      if(codeMatch) {
        links[i][key] = "";
        continue;
      }   
      //URI [http://tools.ietf.org/html/rfc3986#page-50], also accepts '//' as full uri
      var uriProtocol = uri.match(/^[^:\/?#]+:|\/\//);
      if(uriProtocol) continue; //just leave it alone

      //HASTAGS OR QUERIES
      var matchHashtagOrQuery = uri.match(/^#.+|^\?.+/);
      if(matchHashtagOrQuery){
        //append to full url
        links[i][key] = window.location.href + uri;
        continue;
      }
      //PATH ABSOLUTE
      var matchAbsolutePath = uri.match(/^\/[^\/]/);  //only one leading slash
      if(matchAbsolutePath){
        links[i][key] = window.location.origin + uri;
        continue;
      }

      //RELATIVE PATH
      var glue = '/';
      if(window.location.href[window.location.href.length-1] === glue) glue = '';
      links[i][key] = window.location.href + glue + uri;
      console.log(links[i]);
      //if it's javascript, destroy it
      //if it's a hash tag, append it to the full url
      //if it begins with a / then it's relative the the host url
      //if it doesn't begin with, / then we need the url to the current path
    }
  }
  return div.innerHTML;
}

//clean the HTML up, such as giving links their full paths, or making
//psuedo links into plain text
function cleanHTML(html){
  html = giveLinksFullUrls(html);
  return html;
}


//make a clip object from the page selection
function getClipFromPage(){
  var clip = {'url':'','html':''};
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
  return clip;
}

function doneSavingClips(){
  //console.log('Settings saved');
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