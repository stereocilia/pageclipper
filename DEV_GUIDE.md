This 'guide' is meant to give a quick overview of the project's contents
and their relations.

The manifest.json file is what defines the extension

A background script, eventPage.js is defined. When it is launched, 
all the functionality for the extension if bound to events, such as the 
broswerAction button being clicked.

/**
 * manifest.json
 * 
 * https://developer.chrome.com/extensions/manifest
 *
 * Every extension has a JSON-formatted manifest file, named manifest.json, 
 * that provides important information.
 *  
 */
{
  "manifest_version": 2,

  "name": "Page Clipper",
  "description": "Clip parts of a webpage.",
  "version": "1.0",
  /**
   * background
   *
   * https://developer.chrome.com/extensions/event_pages
   * 
   * A common need for apps and extensions is to have a single long-running script 
   * to manage some task or state. Event pages to the rescue. Event pages are loaded 
   * only when they are needed. When the event page is not actively doing something, 
   * it is unloaded, freeing memory and other system resources
   *
   */
  "background": {
    "scripts": ["eventPage.js"],	//array of scripts to run in the background
    "persistent": false				//false makes the script go to sleep when it's not being used
  },
  /**
   * content scripts
   *
   * https://developer.chrome.com/extensions/content_scripts
   *
   * Content scripts are JavaScript files that run in the context of web pages. 
   * By using the standard Document Object Model (DOM), they can read details of 
   * the web pages the browser visits, or make changes to them.
   *
   * Content scripts are not used in this project right now.
   * I'm leaving the comments code here so you remember that it is an option.
   */
  //"content_scripts": [
  //  {
  //    "matches": ["http://www.google.com/*"],
  //    "css": ["mystyles.css"],
  //    "js": ["jquery.js", "myscript.js"]
  //  }
  //],
  /**
   * browser action
   *
   * https://developer.chrome.com/extensions/browserAction 
   */
  "browser_action": {	//this browser action is the button you click in the browser for this extension
    "default_icon": "icon.png"
  },
  /**
   * permission
   *
   * https://developer.chrome.com/extensions/permissions
   * https://developer.chrome.com/extensions/declare_permissions
   *
   * Use the chrome.permissions API to request declared optional permissions 
   * at run time rather than install time, so users understand why the permissions 
   * are needed and grant only those that are necessary.
   * 
   */
  "permissions": [
    "http://*/*",	//permission to access all webpages
    "https://*/*",	//permission to access all secure webpages
    "tabs",			//https://developer.chrome.com/extensions/tabs
    "contextMenus",	//https://developer.chrome.com/extensions/contextMenus
    "storage"		//https://developer.chrome.com/extensions/storage
  ]
}


