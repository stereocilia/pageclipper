/**
 * popup_html.js
 *
 * page code for popup.html
 */

function initializeTinyMCE(){
    // TinyMCE configuration
    // http://www.tinymce.com/wiki.php/Advanced
    // http://www.tinymce.com/wiki.php/Configuration
    // http://www.tinymce.com/wiki.php/Controls
    tinymce.init({
        height:350,
        selector: "#editor",
        style_formats_merge:true,
        style_formats: [
            {title: 'Highlight', inline: 'span', styles: {'background-color': 'yellow'}},
        ]
    });
}

document.body.onload = function(){
    pageclipper.Storage.getClipContent(function(clipContent){
        document.querySelector('#editor').innerHTML = clipContent;
        if(clipContent.length === 0){
            document.querySelector('.msg.noclips').style.display = 'block';
        }
        initializeTinyMCE();
    })
};
