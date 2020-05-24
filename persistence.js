var objectStore = function() {
    const TABLE_NAME = 'gameObjects';
    var db;

    return {
        initStore: function(dbname, successCallback, notSupportedCallback, notAllowedCallback) {
            if (!window.indexedDB) {
                console.log("Browser doesn't support indexed db");
                notSupportedCallback.call();
                return;
            }
            var request = indexedDB.open(dbname, 1);
            request.onupgradeneeded = function(event) {
                db = event.target.result;
                if (!db.objectStoreNames.contains(TABLE_NAME)) {
                    db.createObjectStore(TABLE_NAME, { keyPath: 'name' });
                }		
                var transaction = event.target.transaction;			                
                transaction.oncomplete = function(event) {    
                    console.log("Data store upgraded successfully");
                    successCallback.call(event);						
                }
            };
            request.onerror = function(event) {
                console.log("Unable to create data store. Probably the user has denied this action?");
                notAllowedCallback.call(event);
            };
            request.onsuccess = function(event) {
                console.log('Database opened successfully');
                db = request.result;
                successCallback.call(event);
            }
        },

        saveObject: function(toSave, successCallback, errorCallback) {
            if (!db) {
                console.log('No valid db found. Please call initStore first!');
                errorCallback.call();
                return;
            }
            var transaction = db.transaction([  TABLE_NAME ], "readwrite");
            transaction.oncomplete = function(event) {
                console.log("Successfully saved object")
                successCallback.call(event);
            };

            transaction.onerror = function(event) {
                console.log("Unable to save object. " + event);
                errorCallback.call(event);
            };
            var objectStore = transaction.objectStore(TABLE_NAME);
            objectStore.put(toSave);
        },

        loadObject(name, successCallback, errorCallback) {
            if (!db) {
                console.log('No valid db found. Please call initStore first!');
                errorCallback.call();
                return;
            }
            var transaction = db.transaction([  TABLE_NAME ], "readonly");
            transaction.onerror = function(event) {
                console.log("Unable to load object. " + event);
            };
            var objectStore = transaction.objectStore(TABLE_NAME);
            var request = objectStore.get(name);
            request.onsuccess = function (e) {
                console.log("Loaded object successfully");
                successCallback(e.target.result);
            };

        },

        deleteObject(name) {
            console.log("Need to be implemented!");
        }
    };
}();