(function() {
  var WorkCtrl = function WorkCtrl($rootScope, $scope, appConstants) {

    // keep track of the number of work sessions completed
    var workSessionsCompleted = 0;

    // keep track of the work sessions and if they've been paused
    var workSessions = [];
    var currentWorkSession, sessionPauseCount = 0, sessionPauseLength = 0, totalPauseLength = 0;

    // work session object for keeping track of what is done
    var WorkSession = function WorkSession(id, timesPaused, durationPaused) {
      this.id = id || workSessionsCompleted + 1;
      this.timestamp = Math.floor(new Date() / 1000); // unix epoch (in seconds)
      this.pause_count = timesPaused || 0;
      this.total_pause_length = durationPaused || 0;
      this.completed = false;
      this.tasks = {};
    }; 

    $scope.initializeWork = function initializeWork() {
      //$scope.duration = appConstants.WORK_SESSION;
      $scope.duration = .1; //DEBUG
      $scope.timerType = 'work';
      $scope.showPause = true;
    };

    var beginWorkSession = function beginWorkSession() {
      // capture the work session in a new object 
      currentWorkSession = new WorkSession();
      workSessions.push(currentWorkSession);
    };

    // record if the user pauses their work session
    var countPauses = function countPauses() {
      sessionPauseCount++;
    };
    var monitorSessionPause = function monitorSessionPause(event, data) {
      var length = data.length;
      sessionPauseLength = length;
    };
    var finishSessionPause = function finishSessionPause() {
      totalPauseLength += sessionPauseLength;
      // add this pause event to the session's total
      currentWorkSession.pause_count = sessionPauseCount;
      currentWorkSession.total_pause_length = totalPauseLength;
 
    };

    // actions to take after a work session has been successfully completed
    var finishWorkSession = function finishWorkSession() {
      workSessionsCompleted++;
      currentWorkSession.completed = true;

      // clean up and start a break
      initializeBreak();
    };

    var initializeBreak = function initializeBreak() {
      // check if it's time to give a long break (after multiples of 4 completed work sessions)
      if (workSessionsCompleted % 4 === 0) {
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
    $rootScope.$on('TIMER_FINISHED:work', finishWorkSession);
    $rootScope.$on('TIMER_FINISHED:break', $scope.initializeWork);
    $rootScope.$on('TIMER_FINISHED:longbreak', $scope.initializeWork);
    $rootScope.$on('PAUSE_TRIGGERED', countPauses);
    $rootScope.$on('SESSION_PAUSED', monitorSessionPause);
    $rootScope.$on('PAUSE_FINISHED', finishSessionPause);
  };
  
  angular
    .module('aDoro')
    .controller('WorkCtrl', ['$rootScope', '$scope', 'appConstants', WorkCtrl]);
})();