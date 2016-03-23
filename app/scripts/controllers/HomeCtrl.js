(function() {
  var HomeCtrl = function HomeCtrl($rootScope, $scope, $firebaseArray, appConstants) {
    // TODO: wire up Firebase database once the logic has been written
    var ref = new Firebase('https://awesomedoro.firebaseio.com/');
    $scope.messages = $firebaseArray(ref);

    // keep track of the number of work sessions completed
    var workSessionsCompleted = 0;

    $scope.initializeWork = function startWork() {
      //$scope.duration = appConstants.WORK_SESSION;
      $scope.duration = .1; //DEBUG
      $scope.timerType = 'work';
    };

    var finishWorkSession = function finishWorkSession() {
      workSessionsCompleted++;
      console.log('workSessionsCompleted: ' + workSessionsCompleted);
      initializeBreak();
    };

    var initializeBreak = function startBreak() {

      // check if it's time to give a long break (after multiples of 4 completed work sessions)
      if (workSessionsCompleted % 4 === 0) {
        //$scope.duration = appConstants.LONG_BREAK_SESSION;
        $scope.duration = .15; //DEBUG
        $scope.timerType = 'longbreak';
      } else {
        //$scope.duration = appConstants.BREAK_SESSION;
        $scope.duration = .05; //DEBUG
        $scope.timerType = 'break';
      }
    };

    // watch for notifications from the timer
    $rootScope.$on('timerfinished:work', finishWorkSession);
    $rootScope.$on('timerfinished:break', $scope.initializeWork);
    $rootScope.$on('timerfinished:longbreak', $scope.initializeWork);

  };
  
  angular
    .module('aDoro')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$firebaseArray', 'appConstants', HomeCtrl]);
})();