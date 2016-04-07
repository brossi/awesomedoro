(function() {
  var showTodos = function showTodos() {
    return function(data, limitBy) {

      var getUnixTimestamp = function getUnixTimestamp() {
        // generate a unix epoch timestamp (in seconds)
        return Math.floor(new Date() / 1000);
      }

      var currentTime = getUnixTimestamp();
      var output = data;
      var latest, earliest;

      switch(limitBy) {
        case 'recent':
            // show todos newer than one hour (in seconds)
            latest = currentTime;
            earliest = currentTime - 120;
            break;
        case 'archived':
            // show todos older than one hour (in seconds)
            latest = currentTime - 120;
            earliest = 0;
            break;
        default:
            latest = currentTime;
            earliest = 0;
      }

      var withinRange = function withinRange(val, latest, earliest) {
        if (val < latest && val > earliest) {
          return true;
        }
      };

      // only fire if the data array has elements in it
      if (output.length > 0) {
        console.log('-----');
        var todoCount = output.length;
        for (var i = 0; i < todoCount; i++) {
          var item = output[i];
          var createdAt = item['created_at'];
          // only pull in items that are older than the cutoff
          var inRange = withinRange(createdAt, latest, earliest);
          if (inRange) {
            item.showInList = true;
          //  output.splice(i,1);
          }
        }

      }
      return output;

    };
  };

  angular
    .module('aDoro')
    .filter('showTodos', showTodos);
 })();