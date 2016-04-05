(function() {
  var timecode = function timecode() {
    return function(seconds) {

      if (Number.isNaN(seconds)) {
        return '-:--';
      }

      var seconds = Number.parseFloat(seconds);
      var wholeSeconds = Math.floor(seconds);
      var minutes = Math.floor(wholeSeconds / 60);
      var remainingSeconds = wholeSeconds % 60;

      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      var output = minutes + ':';

      if (remainingSeconds < 10) {
        output += '0';   
      }
      output += remainingSeconds;
      return output;
    };
  };

  angular
    .module('aDoro')
    .filter('timecode', timecode);
 })();