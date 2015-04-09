(function(){
  //TODO: Also a function to clip a picture.
      if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
        	console.log(selection);
          var range = selection.getRangeAt(0);
          var clonedSelection = range.cloneContents();
	  //remove class attribute from all elements.
	  //this will prevent styles bleeding in from
	  //the current page
	  
	  //also filter out class of addthis_toolbox
	  //by removing its parent element from the DOM
          var div = document.createElement('div');
          div.appendChild(clonedSelection);
		  chrome.runtime.sendMessage({
		  	"html": div.innerHTML, 
		  	'url': window.location.href
		  });
        }
      }
})();
