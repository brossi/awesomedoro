(function() {
  var WorkCtrl = function WorkCtrl($rootScope, $scope, appConstants) {

    // keep track of the number of work sessions completed
    var workSessionsCompleted = 0;

    // keep track of the work sessions and if they've been paused
    var workSessions = [];
    var previousSession;

    // work session object for keeping track of what is done
    var WorkSession = function WorkSession(id, timesPaused, durationPaused) {
      this.id = id || workSessionsCompleted + 1;
      this.timestamp = Math.floor(new Date() / 1000); // unix epoch (in seconds)
      this.paused = timesPaused || 0;
      this.duration_paused = durationPaused || 0;
      this.completed = false;
      this.tasks = {};
    }; 

    $scope.initializeWork = function initializeWork() {
      //$scope.duration = appConstants.WORK_SESSION;
      $scope.duration = .1; //DEBUG
      $scope.timerType = 'work';
      $scope.showPause = true;

      var currentSession = new WorkSession();
      workSessions.push(currentSession);
      previousSession = currentSession;

      //DEBUG
      var count = currentSession.id;
      console.log(workSessions[count - 1]);
    };

    var finishWorkSession = function finishWorkSession() {
      workSessionsCompleted++;
      previousSession.completed = true;
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

    var sessionPause = function sessionPause() {
      console.log('Session pause fired');
    };

    // watch for notifications from the timer
    $rootScope.$on('timerfinished:work', finishWorkSession);
    $rootScope.$on('timerfinished:break', $scope.initializeWork);
    $rootScope.$on('timerfinished:longbreak', $scope.initializeWork);
    $rootScope.$on('sessionPause', $scope.sessionPause);
  };
  
  angular
    .module('aDoro')
    .controller('WorkCtrl', ['$rootScope', '$scope', 'appConstants', WorkCtrl]);
})();