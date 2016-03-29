(function() {
  var WorkCtrl = function WorkCtrl($rootScope, $scope, appConstants) {

    // keep track of the number of work sessions completed
    var workSessionsCompleted = 0;

    $scope.initializeWork = function initializeWork() {
      //$scope.duration = appConstants.WORK_SESSION;
      $scope.duration = .1; //DEBUG
      $scope.timerType = 'work';
      $scope.showPause = true;
    };

    var finishWorkSession = function finishWorkSession() {
      workSessionsCompleted++;
      console.log('workSessionsCompleted: ' + workSessionsCompleted);
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
    $rootScope.$on('timerfinished:work', finishWorkSession);
    $rootScope.$on('timerfinished:break', $scope.initializeWork);
    $rootScope.$on('timerfinished:longbreak', $scope.initializeWork);
  };
  
  angular
    .module('aDoro')
    .controller('WorkCtrl', ['$rootScope', '$scope', 'appConstants', WorkCtrl]);
})();