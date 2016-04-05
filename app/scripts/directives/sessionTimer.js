(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name aDoro.directive:sessionTimer
   * @description
   * # sessionTimer
   */
  var sessionTimer = function sessionTimer($rootScope, $interval, appConstants, $filter) {

    return {
      templateUrl: '/templates/directives/session_timer.html',
      replace: true,
      restrict: 'E',
      scope: {
        duration: '@',
        type: '@',
        pause: '@'
      },
      link: function(scope, element, attributes) {
        var timerDuration, currentTime, lastCurrentTime, lastTimerType, currentPauseTime, showPause, status;

        // sound effect for completed session
        var completionSound = new buzz.sound(
          '/assets/sounds/two-bells-ship-time', {
            formats: ['mp3'],
            preload: true,
            volume: 40
          });

        scope.Initialize = function() {
          // initialize timer object and type
          scope.Timer = null;
          scope.TimerType = scope.type;
          scope.ShowPause = scope.pause;

          // initialize timer duration, falling back if not defined and then convert from minutes to seconds
          timerDuration = scope.duration || appConstants.WORK_SESSION;
          timerDuration = timerDuration * 60;

          // intialize countdown object, but first check to make sure that there hasn't been a previously saved 
          lastCurrentTime > 0 ? (currentTime=lastCurrentTime) : (currentTime=timerDuration);
          scope.Countdown = currentTime;

          // initialize button state and handle toggle
          scope.btnVisible = true;
          // toggle visibility on the "pause" button to hide it, if visible from a previous run
          scope.timerRunning = false;

        };
        scope.Initialize();

        // start timer function
        scope.StartTimer = function(status) {
          // only broadcast notification if this is the start of a session;
          // used to prevent the timer from triggering a new object after a pause
          if (!status) {
            $rootScope.$emit('TIMER_STARTED:' + scope.TimerType);
          }
          // initialize the timer to run every 1000 milliseconds (1 second tick)
          scope.Timer = $interval(function() {
            currentTime--;
            scope.Countdown = currentTime;

            // when the timer reaches zero, stop the countdown
            if (currentTime === 0) {
              $interval.cancel(scope.Timer);
              // announce the end of the session with a sound
              completionSound.play();
              // broadcast the state change
              $rootScope.$emit('TIMER_FINISHED:' + scope.TimerType);
              // reset timer to default state
              scope.duration = null;
              lastCurrentTime = 0;

              scope.Initialize();
            }
          }, 1000);
          // toggle button state from "start" to "reset"
          scope.btnVisible = false;
          // toggle visibility on the "pause" button to show it if allowed by session type
          if (scope.ShowPause === 'true') {
            scope.timerRunning = true;
          }
        }

        // pause timer function and keep track of state
        scope.StartPauseTimer = function() {
          if (angular.isDefined(scope.Timer)) {
            
            // cancel current timer and store off the values for use when resuming
            $interval.cancel(scope.Timer);
            // hide the pause button
            scope.timerRunning = false;

            lastCurrentTime = currentTime; // pass back into scope.duration, later
            lastTimerType = scope.TimerType; // store for returning to the same state later

            // start countup timer for how long the pause has lasted
            currentPauseTime = 0;
            // set timer in template to 00:00 to start counting up
            scope.Countdown = 0;
            // show the resume button and hide the reset button
            scope.pauseTimerRunning = true;
            // set the new display for timer type
            scope.TimerType = lastTimerType + ' session paused. ' + $filter('timecode')(lastCurrentTime) + 
            ' remaining.';

            // single notification that the session is being paused to trigger external functions
            $rootScope.$emit('PAUSE_TRIGGERED');

            scope.Timer = $interval(function() {
              currentPauseTime++;
              scope.Countdown = currentPauseTime;
            }, 1000);
          }
        }

        // resume work session from 'paused' state
        scope.ResumePreviousTimer = function() {
          if (angular.isDefined(scope.Timer)) {

            $rootScope.$emit('PAUSE_FINISHED');
            // cancel the timer and reset the value to the original duration
            $interval.cancel(scope.Timer);
            // reinitialize timer type and duration, using previously stored values
            currentTime = lastCurrentTime;
            scope.TimerType = lastTimerType;
            scope.Initialize();

            // hide resume button
            scope.pauseTimerRunning = false;

            // start timer
            status = 'fromPause';
            scope.StartTimer(status);

          }
        }

        // stop timer function
        scope.ResetTimer = function() {
          if (angular.isDefined(scope.Timer)) {
            // cancel the timer and reset the value to the original duration
            $interval.cancel(scope.Timer);

            // initialize timer type and duration, falling back if not defined and then convert from minutes to seconds
            scope.Initialize();
          }
        }

        // watch for changes and update the timer as needed
        scope.$watch('duration', function(newVal, oldVal) {
          // pass new values to set up new timer state
          //scope.ResetTimer();
          scope.Initialize();
        });
      }
    };
  };
  angular
      .module('aDoro')
      .directive('sessionTimer', ['$rootScope', '$interval', 'appConstants', '$filter', sessionTimer])
})();
