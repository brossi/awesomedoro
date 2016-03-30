(function() {
  var WorkCtrl = function WorkCtrl($rootScope, $scope, appConstants) {

    var sessions = [];
    var tempSession = {};
    var workCompleted = 0;
    var pauseStart, pauseEnd;
    var sessionPauseCount = 0;
    var sessionPauseLength = 0;
    var totalPauseLength = 0;

    var getUnixTimestamp = function getUnixTimestamp() {
      // generate a unix epoch timestamp (in seconds)
      return Math.floor(new Date() / 1000);
    }

    $scope.initializeWork = function initializeWork() {
      //$scope.duration = appConstants.WORK_SESSION;
      $scope.duration = .1; //DEBUG
      $scope.timerType = 'work';
      $scope.showPause = true;
    };

    var beginWorkSession = function beginWorkSession() {
      console.log('beginWorkSession');
      // capture the work session in a new object 
      tempSession.id = workCompleted + 1;
      tempSession.timestamp = getUnixTimestamp();
      tempSession.pause_count = 0;
      tempSession.total_pause_length = 0;
      tempSession.tasks = {};
      tempSession.completed = false;
      console.log(tempSession);
    };

    var startSessionPause = function startSessionPause() {
      console.log('startSessionPause');
      pauseStart = getUnixTimestamp();
      console.log(pauseStart);
    };

    var calcPauseLength = function calcPauseLength(pauseStart, pauseEnd) {
      // accept start timestamp and end timestamp and return the difference
      return (pauseEnd - pauseStart);
    };

    var finishSessionPause = function finishSessionPause() {
      console.log('finishSessionPause');
      pauseEnd = getUnixTimestamp();
      sessionPauseCount++;
      sessionPauseLength = calcPauseLength(pauseStart, pauseEnd);
      totalPauseLength += sessionPauseLength;
      tempSession.pause_count = sessionPauseCount;
      tempSession.total_pause_length = totalPauseLength;
      //console.log(tempSession);
    };

    var finishWorkSession = function finishWorkSession() {
      console.log('finishWorkSession');
      workCompleted++;
      tempSession.completed = true;
      console.log(tempSession);
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

    // watch for notifications from the timer
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