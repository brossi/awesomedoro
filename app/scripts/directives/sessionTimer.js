(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name aDoro.directive:sessionTimer
   * @description
   * # sessionTimer
   */
  var sessionTimer = function sessionTimer($interval) {
    // initialize duration of timer
    // this should be turn into a variable, eventually
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

        // initialize button state and handle toggle
        scope.btnVisible = true;
        
        // start timer function
        scope.StartTimer = function() {
          // initialize the timer to run every 1000 milliseconds (1 second tick)
          scope.Timer = $interval(function() {
            currentTime--;
            scope.Countdown = currentTime;
          }, 1000);
          // toggle button state from "start" to "reset"
          scope.btnVisible = false;
        }

        // stop timer function
        scope.StopTimer = function() {
          scope.Countdown = 'Timer stopped.';
          // cancel the timer and reset the value
          if (angular.isDefined(scope.Timer)) {
            $interval.cancel(scope.Timer);
            currentTime = timerDuration;
            scope.Countdown = timerDuration;
            
            // reset button state from "reset" to "start"
            scope.btnVisible = true;
          }
        }
      }
    };
  };
  angular
      .module('aDoro')
      .directive('sessionTimer', ['$interval', sessionTimer])
})();
