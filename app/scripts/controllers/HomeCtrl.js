(function() {
  var HomeCtrl = function HomeCtrl($rootScope, $scope, $firebaseArray, appConstants) {
    // TODO: wire up Firebase databse once the logic has been written
    var ref = new Firebase('https://awesomedoro.firebaseio.com/');
    $scope.messages = $firebaseArray(ref);

    var startWork = function startWork() {
      console.log('Work can start now.')
      onBreak = false;
      $scope.duration = appConstants.WORK_SESSION;
      //$scope.duration = .1; //DEBUG
      $scope.timerType = 'work';
    };

    var startBreak = function startBreak() {
      console.log('Break can start now.');
      onBreak = true;
      $scope.duration = appConstants.BREAK_SESSION;
      //$scope.duration = .05; //DEBUG
      $scope.timerType = 'break';
    };

    var startNextSession = function startNextSession() {
      // TODO: set this up to check against the previously completed session if there was one and then pick the appropriate type for the next one.
      // Until that is done, just use the discrete functions from the .$on watchers below
      startBreak();
    };

    // initial type of the timer when the page loads is set to 'work'
    startWork();

    // watch for notifications from the timer
    $rootScope.$on('timerfinished:work', startBreak);
    $rootScope.$on('timerfinished:break', startWork);

  };
  
  angular
    .module('aDoro')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$firebaseArray', 'appConstants', HomeCtrl]);
})();