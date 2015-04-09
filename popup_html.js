// TinyMCE configuration
// http://www.tinymce.com/wiki.php/Advanced
// http://www.tinymce.com/wiki.php/Configuration
// http://www.tinymce.com/wiki.php/Controls
tinymce.init({
    selector: "#editor",
    style_formats_merge:true,
    style_formats: [
        {title: 'Highlight', block: 'span', styles: {'background-color': 'yellow'}},
    ]
});