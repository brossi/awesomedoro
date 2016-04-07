(function() {
  var WorkCtrl = function WorkCtrl($rootScope, $scope, appConstants) {

    $scope.$parent.sessions.data = [];
    var isTimerRunning = $scope.$parent.isTimerRunning;
    console.log(isTimerRunning);
    var TMPSession, sessionPauseCount, sessionPauseLength, totalPauseLength;
    var workCompleted = 0;
    var eventStart, eventEnd;

    var getUnixTimestamp = function getUnixTimestamp() {
      // generate a unix epoch timestamp (in seconds)
      return Math.floor(new Date() / 1000);
    }

    var cleanTMPSession = function cleanTMPSession() {
      // ensure global objects begin from a clean state
      TMPSession = {};
      sessionPauseCount = 0;
      sessionPauseLength = 0;
      totalPauseLength = 0;
    };

    $scope.initializeWork = function initializeWork() {
      //$scope.duration = appConstants.WORK_SESSION;
      $scope.duration = .1; //DEBUG
      $scope.timerType = 'work';
      $scope.showPause = true;
    };

    var beginWorkSession = function beginWorkSession() {
      // console.log('beginWorkSession'); //DEBUG
      // report up to the parent controller of the state change
      $scope.$parent.isTimerRunning.data = true;
      // ensure we're starting from a clean session state
      cleanTMPSession();
      // capture the work session in a temporary object that we'll clear
      TMPSession.id = workCompleted + 1;
      TMPSession.started_at = getUnixTimestamp();
      TMPSession.pause_count = 0;
      TMPSession.total_pause_length = 0;
    };

    var startSessionPause = function startSessionPause() {
      // console.log('startSessionPause'); //DEBUG
      // capture the timestamp for the start of a work session "pause"
      eventStart = getUnixTimestamp();
    };

    var calcTimeDifference = function calcTimeDifference(eventStart, eventEnd) {
      // accept start timestamp and end timestamp and return the difference
      return (eventEnd - eventStart);
    };

    var finishSessionPause = function finishSessionPause() {
      // console.log('finishSessionPause'); //DEBUG
      eventEnd = getUnixTimestamp();
      // increment the session counter and length with new values from the recent pause
      sessionPauseCount++;
      sessionPauseLength = calcTimeDifference(eventStart, eventEnd);
      totalPauseLength += sessionPauseLength;
      TMPSession.pause_count = sessionPauseCount;
      TMPSession.total_pause_length = totalPauseLength;
    };

    var finishWorkSession = function finishWorkSession() {
      // console.log('finishWorkSession'); //DEBUG
      // mark the session as complete to confirm that the record was captured correctly
      TMPSession.completed_at = getUnixTimestamp();
      // push the work session into the sessions array
      $scope.$parent.sessions.data.push(TMPSession);
      // $scope.sessions = sessions; //DEBUG
      // broadcast to the rest of the app that the new session object is ready for processing
      $rootScope.$emit('WorkSessionRecorded');
      // increment the global counter
      workCompleted++;
      // clean up the temporary session object and globals
      cleanTMPSession();
      // report up to the parent controller of the state change
      $scope.$parent.isTimerRunning.data = false;
      // set up for the next session, a break
      initializeBreak();
    };

    var initializeBreak = function initializeBreak() {
      // check if it's time to give a long break (after multiples of 4 completed work sessions)
      if (workCompleted % 4 === 0) {
        //$scope.duration = appConstants.LONG_BREAK_SESSION;
        $scope.duration = .15; //DEBUG
        $scope.timerType = 'longbreak';
        $scope.showPause = false;
      } else {
        //$scope.duration = appConstants.BREAK_SESSION;
        $scope.duration = .05; //DEBUG
        $scope.timerType = 'break';
        $scope.showPause = false;
      }
    };

    // Listen for event notifications from the `sessionTimer` directive
    $rootScope.$on('TIMER_STARTED:work', beginWorkSession);
    $rootScope.$on('PAUSE_TRIGGERED', startSessionPause);
    $rootScope.$on('PAUSE_FINISHED', finishSessionPause);
    $rootScope.$on('TIMER_FINISHED:work', finishWorkSession);
    $rootScope.$on('TIMER_FINISHED:break', $scope.initializeWork);
    $rootScope.$on('TIMER_FINISHED:longbreak', $scope.initializeWork);

  };
  
  angular
    .module('aDoro')
    .controller('WorkCtrl', ['$rootScope', '$scope', 'appConstants', WorkCtrl]);
})();