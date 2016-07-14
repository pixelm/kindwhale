var trackedTimeData = {
   timing: {}
},
    currentTabUrl = null;

var TIME_TRACKER_STORAGE_KEY = 'timeTracker:0.1';
var CHECK_TAB_INTERVAL_MS = 1000;

init();

/////////////////

function init() {
   restoreExtensionData();
   setInterval(checkCurrentTabTimerFired, CHECK_TAB_INTERVAL_MS);
   
   chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
         if (request.action === window.timeTrackerActions.windowReceivedFocus) {
            windowReceivedFocus(request, sender, sendResponse)
         } else if (request.action === window.timeTrackerActions.windowLostFocus) {
            windowLostFocus(request, sender, sendResponse)
         } else if (request.action === window.timeTrackerActions.getTimingData) {
            getTimingData(request, sender, sendResponse)
         }
      });
}

//////////////////////

function restoreExtensionData() {
   var storageDataString = localStorage[TIME_TRACKER_STORAGE_KEY];

   if (storageDataString) {
      var data = JSON.parse(storageDataString);
      trackedTimeData = data.trackedTimeData;
   } else {
      trackedTimeData = {
         timing: {}
      };
   }
}

function commitChanges() {
   var extensionState = {
      trackedTimeData: trackedTimeData
   };

   localStorage[TIME_TRACKER_STORAGE_KEY] = JSON.stringify(extensionState);
}

function checkCurrentTabTimerFired() {
   if (!currentTabUrl) {
      return;
   }

   if (trackedTimeData.timing[currentTabUrl]) {
      trackedTimeData.timing[currentTabUrl].timeSpent++;
   }
   else {
      trackedTimeData.timing[currentTabUrl] = {
         url: currentTabUrl,
         timeSpent: 1
      };
   }
   
   commitChanges();
}

function windowReceivedFocus(request, sender, sendResponse) {
   setTimeout(function () {
      console.log("focus: " + moment() + " " + request.data.url);
      currentTabUrl = request.data.url;
   }, 100);
}

function windowLostFocus(request, sender, sendResponse) {
   console.log("blur: " + moment());
   currentTabUrl = null;
}

function getTimingData(request, sender, sendResponse) {
   sendResponse({
      timingData: trackedTimeData.timing
   });
}