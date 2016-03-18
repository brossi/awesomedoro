(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name aDoro.directive:sessionTimer
   * @description
   * # sessionTimer
   */
  var sessionTimer = function sessionTimer($rootScope, $interval) {

    return {
      templateUrl: '/templates/directives/session_timer.html',
      replace: true,
      restrict: 'E',
      scope: {
        duration: '='
      },
      link: function(scope, element, attributes) {
        // initialize timer duration
        var timerDuration = scope.duration || 25;
        var timerDuration = timerDuration * 60;
        // initialize timer object
        scope.Timer = null;
        // intialize countdown object
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

            // when the timer reaches zero, stop the countdown
            if (currentTime === 0) {
              $interval.cancel(scope.Timer);
              // broadcast the state change
              $rootScope.$broadcast('timerfinished');
            }
          }, 1000);
          // toggle button state from "start" to "reset"
          scope.btnVisible = false;
        }

        // stop timer function
        scope.StopTimer = function() {
        
          if (angular.isDefined(scope.Timer)) {

            // cancel the timer and reset the value to the original duration
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
      .directive('sessionTimer', ['$rootScope', '$interval', sessionTimer])
})();
