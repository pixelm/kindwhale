$(function () {
   var timingData = {};

   initPopupState()

   ///////////////////////

   function initPopupState() {
      var getPreferencesMessage = {
         action: window.timeTrackerActions.getTimingData
      };

      chrome.runtime.sendMessage(getPreferencesMessage, function (response) {
         timingData = response.timingData;
         initPieChart();
      });
   }


   //////////////////////

   function initPieChart() {
      var content = [],
          colors = window.getPieChartColors(),
          colorCounter = 0;
      
      for (var key in timingData) {
         if (timingData.hasOwnProperty(key)) {
            var timingItem = timingData[key],
               contentItem = {};
            
            contentItem.label = timingItem.url;
            contentItem.value = timingItem.timeSpent;
            contentItem.color = colors[colorCounter];
            
            colorCounter++;
            if (colorCounter >= colors.length) {
               colorCounter = 0;
            }
            
            content.push(contentItem);
         }
      }
      
      console.log(content);
      
      if (!content.length) {
         return;
      }
      
      var pie = new d3pie("pieChart", {
         "header": {
            "title": {
               "fontSize": 24,
               "font": "open sans"
            },
            "subtitle": {
               "color": "#999999",
               "fontSize": 12,
               "font": "open sans"
            },
            "titleSubtitlePadding": 10
         },
         "footer": {
            "color": "#999999",
            "fontSize": 10,
            "font": "open sans",
            "location": "bottom-left"
         },
         "size": {
            "canvasHeight": 400,
            "canvasWidth": 550,
            "pieOuterRadius": "90%"
         },
         "data": {
            "sortOrder": "value-desc",
            "smallSegmentGrouping": {
               "enabled": true,
               "value": 2
            },
            "content": content
         },
         "labels": {
            "outer": {
               "pieDistance": 32
            },
            "inner": {
               "hideWhenLessThanPercentage": 3
            },
            "mainLabel": {
               "fontSize": 11
            },
            "percentage": {
               "color": "#ffffff",
               "decimalPlaces": 0
            },
            "value": {
               "color": "#adadad",
               "fontSize": 11
            },
            "lines": {
               "enabled": true
            },
            "truncation": {
               "enabled": true
            }
         },
         "tooltips": {
            "enabled": true,
            "type": "placeholder",
            "string": "{label}: {percentage}%"
            //"string": "{label}: {value}, {percentage}%"
         },
         "effects": {
            "pullOutSegmentOnClick": {
               "effect": "linear",
               "speed": 400,
               "size": 8
            }
         },
         "misc": {
            "gradient": {
               "enabled": true,
               "percentage": 100
            }
         },
         "callbacks": {}
      });
   }
});