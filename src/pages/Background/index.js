


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("change info is ")
  console.log(changeInfo)
  if (changeInfo.status == 'loading') {
    chrome.storage.sync.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
  }
});

// chrome.action.onClicked.addListener(async (tab) => {
//   await chrome.scripting.executeScript({
//     target: { tabId: tab.id, allFrames: true },
//     files: ["./contentScript.bundle.js"],
//   });

//   await chrome.scripting.executeScript({
//     target: { tabId: tab.id, allFrames: true },
//     files: ["./contentScript.bundle.js"],
//   });

//   console.log("clicked")
//   // Do other stuff...
// });


// chrome.action.onClicked.addListener((tab) => {
//   chrome.tabs.create({url: "https://www.youtube.com"});
// });


