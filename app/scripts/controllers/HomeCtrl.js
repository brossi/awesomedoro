(function() {
  var HomeCtrl = function HomeCtrl($scope) {
    $scope.sessions = {
      data: []
    };
    // capture state of timer
    $scope.isTimerRunning = {
      data: false
    };
  };
  
  angular
    .module('aDoro')
    .controller('HomeCtrl', ['$scope', HomeCtrl]);
})();