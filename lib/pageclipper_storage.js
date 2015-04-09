/**
 *
 * storage.js
 *
 */
(function(root, factory){
    if( !('pageclipper' in root) ){
        root.pageclipper = {};
    }
    factory(root.pageclipper);
})(this, function(pageclipper){

    /**
     * _storageKey
     *
     * The name used to save clipped content to local storage
     *
     * @type {string}
     * @private
     */
    var _storageKey = 'clippedContent';

    /**
     * _clippedContent
     *
     * in memory clips loaded from local storage
     *
     * @type {String}
     */
    var _clippedContent = '';

    function callbackClipsFetchedFromStorage(fetchedData, callback) {
        callback.call(this, _clippedContent = fetchedData[_storageKey] || '');  //set the clippedContent and pass it to the callback
    }

    function fetchClipsFromStorage(callback) {
        if(!callback || typeof callback !== 'function') throw new Error('pageclipper.Storage.fetchClipsFromStorage cannot be executed without a callback function');
        chrome.storage.local.get(_storageKey, function(fetchedData){
            callbackClipsFetchedFromStorage.call(this, fetchedData, callback);
        });
    }

    pageclipper.Storage = {};
    pageclipper.Storage.getClips = function(callback){
        fetchClipsFromStorage(callback);
    }
});