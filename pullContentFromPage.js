(function(){
      if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
        	console.log(selection);
          var range = selection.getRangeAt(0);
          var clonedSelection = range.cloneContents();
          var div = document.createElement('div');
          div.appendChild(clonedSelection);
		  chrome.runtime.sendMessage({
		  	"html": div.innerHTML, 
		  	'url': window.location.href
		  });
        }
      }
})();
