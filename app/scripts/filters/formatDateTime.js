(function() {
  var formatDateTime = function formatDateTime() {
    return function(timestamp) {
      var output = Date.create(timestamp).format('{12hr}:{mm}{tt} on {Weekday}');
      return output;

    };
  };

  angular
    .module('aDoro')
    .filter('formatDateTime', formatDateTime);
 })();