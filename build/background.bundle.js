chrome.tabs.onUpdated.addListener((function(o,e,n){console.log("change info is "),console.log(e),"loading"==e.status&&chrome.storage.sync.clear((function(){var o=chrome.runtime.lastError;o&&console.error(o)}))}));