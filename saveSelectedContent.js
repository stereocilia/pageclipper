/**
 * File: saveSelectedContent.js
 *
 *
 */
(function(){

    //TODO: Does this need to be finished?
    function removeInlineCodeFromLinks() {
        //remove any href javascript calls
    }

    function giveLinksFullUrls(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var links = div.querySelectorAll('a, img');
        for (var i = 0; i < links.length; i++) {
            var key = '';
            if (links[i].href) key = 'href';
            else if (links[i].src) key = 'src';

            if (key.length) {
                var uri = links[i].getAttribute(key);
                if (key === 'href') {
                    links[i].setAttribute('target', '_blank');
                }
                //JAVASCRIPT
                var codeMatch = uri.match(/^javascript\:/);
                if (codeMatch) {
                    links[i][key] = "";
                    continue;
                }
                //URI [http://tools.ietf.org/html/rfc3986#page-50], also accepts '//' as full uri
                var uriProtocol = uri.match(/^[^:\/?#]+:|\/\//);
                if (uriProtocol) continue; //just leave it alone

                //HASTAGS OR QUERIES
                var matchHashtagOrQuery = uri.match(/^#.+|^\?.+/);
                if (matchHashtagOrQuery) {
                    //append to full url
                    links[i][key] = window.location.href + uri;
                    continue;
                }
                //PATH ABSOLUTE
                var matchAbsolutePath = uri.match(/^\/[^\/]/);  //only one leading slash
                if (matchAbsolutePath) {
                    links[i][key] = window.location.origin + uri;
                    continue;
                }

                //RELATIVE PATH
                var glue = '/';
                if (window.location.href[window.location.href.length - 1] === glue) glue = '';
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

    /**
     * cleanHTML
     * @param html The HTML to be cleaned
     * @returns {*}
     */
    function cleanHTML(html) {
        html = giveLinksFullUrls(html);
        //Do other stuff to the HTML here.
        return html;
    }


    /**
     * getSelectedContentFromPage
     * @returns {string}
     */
    function getSelectedContentFromPage() {
        var clip = '';
        var contentSelection = window.getSelection();
        if (contentSelection.rangeCount > 0) {
            var selectionRange = contentSelection.getRangeAt(0);
            var clonedContents = selectionRange.cloneContents();
            var div = document.createElement('div');
            div.appendChild(clonedContents);
            clip = cleanHTML(div.innerHTML);
        }
        return clip;
    }

    function doneSavingClippedContent() {
        //console.log('Settings saved');
    }

    /**
     * doneGettingSelectedContent
     * @param fetchedData
     */
    function doneFetchingClippedContent(fetchedData) {
        if (!fetchedData.clippedContent) {
            fetchedData.clippedContent = '';
        }
        var clip = getSelectedContentFromPage();
        fetchedData.clippedContent += '<div>' + clip + '</div>';
        chrome.storage.local.set(fetchedData, doneSavingClippedContent);
    }

    /**
     * saveSelectContentToStorage
     */
    function saveSelectContentToStorage() {
        chrome.storage.local.get('clippedContent', doneFetchingClippedContent);
    }

    saveSelectContentToStorage();

})();