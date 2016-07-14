var $window = $(window);

$(document).ready(sendFocusMessage);
$window.focus(sendFocusMessage);
$window.blur(sendBlurMessage);

function sendFocusMessage() {
   var windowReceivedFocusMessage = {
      action: window.timeTrackerActions.windowReceivedFocus,
      data: {
         url: window.getPageUrl()
      }
   };

   chrome.runtime.sendMessage(windowReceivedFocusMessage);
}

function sendBlurMessage() {
   var windowLostFocusMessage = {
      action: window.timeTrackerActions.windowLostFocus,
      data: {
         url: window.getPageUrl()
      }
   };

   chrome.runtime.sendMessage(windowLostFocusMessage);
}