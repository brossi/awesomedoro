(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name aDoro.directive:sessionTimer
   * @description
   * # sessionTimer
   */
  var sessionTimer = function sessionTimer($rootScope, $interval, appConstants) {

    return {
      templateUrl: '/templates/directives/session_timer.html',
      replace: true,
      restrict: 'E',
      scope: {
        duration: '@',
        type: '@'
      },
      link: function(scope, element, attributes) {

        // initialize timer object and type
        scope.Timer = null;
        scope.TimerType = scope.type;

        // initialize timer duration, falling back if not defined and then convert from minutes to seconds
        var timerDuration = scope.duration || appConstants.WORK_SESSION;
        timerDuration = timerDuration * 60;

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
              $rootScope.$broadcast('timerfinished:' + scope.TimerType);
            }
          }, 1000);
          // toggle button state from "start" to "reset"
          scope.btnVisible = false;
        }

        // stop timer function
        scope.ResetTimer = function() {
        
          if (angular.isDefined(scope.Timer)) {
            // cancel the timer and reset the value to the original duration
            $interval.cancel(scope.Timer);

            // initialize timer type and duration, falling back if not defined and then convert from minutes to seconds
            scope.TimerType = scope.type;
            timerDuration = scope.duration;
            timerDuration = timerDuration * 60;

            // intialize countdown object
            currentTime = timerDuration;
            scope.Countdown = currentTime;

            // initialize button state and handle toggle
            scope.btnVisible = true;
          }
        }

        // watch for changes and update the timer as needed
        scope.$watch('duration', function(newVal, oldVal) {
          // pass new values to set up new timer state
          scope.ResetTimer();
        });
      }
    };
  };
  angular
      .module('aDoro')
      .directive('sessionTimer', ['$rootScope', '$interval', 'appConstants', sessionTimer])
})();
