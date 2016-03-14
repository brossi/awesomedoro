(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name aDoro.directive:sessionTimer
   * @description
   * # sessionTimer
   */
  var sessionTimer = function sessionTimer($interval) {
    return {
      templateUrl: '/templates/directives/session_timer.html',
      replace: true,
      restrict: 'E',
      scope: {},
      link: function(scope, element, attributes) {
        // initialize timer object
        scope.Timer = null;
        // intialize message object
        var currentTime = 1500;
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
          // cancel the timer
          if (angular.isDefined(scope.Timer)) {
            $interval.cancel(scope.Timer);
          }
        }
      }
    };
  };
  angular
      .module('aDoro')
      .directive('sessionTimer', ['$interval', sessionTimer])
})();
