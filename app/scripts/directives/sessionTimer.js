(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name aDoro.directive:sessionTimer
   * @description
   * # sessionTimer
   */
  var sessionTimer = function sessionTimer($interval) {
    var timerDuration = 1500;
    return {
      templateUrl: '/templates/directives/session_timer.html',
      replace: true,
      restrict: 'E',
      scope: {},
      link: function(scope, element, attributes) {
        // initialize timer object
        scope.Timer = null;
        // intialize message object
        var currentTime = timerDuration;
        scope.Countdown = currentTime;
        
        // start timer function
        scope.StartTimer = function() {
          // initialize the timer to run every 1000 milliseconds (1 second tick)
          scope.Timer = $interval(function() {
            currentTime--;
            scope.Countdown = currentTime;
          }, 1000);
        }

        // stop timer function
        scope.StopTimer = function() {
          scope.Countdown = 'Timer stopped.';
          // cancel the timer and reset the value
          if (angular.isDefined(scope.Timer)) {
            $interval.cancel(scope.Timer);
            console.log(timerDuration);
            currentTime = timerDuration;
            scope.Countdown = timerDuration;
          }
        }
      }
    };
  };
  angular
      .module('aDoro')
      .directive('sessionTimer', ['$interval', sessionTimer])
})();
