(function() {
  var HomeCtrl = function HomeCtrl($rootScope, $scope, $firebaseArray) {
    var ref = new Firebase('https://awesomedoro.firebaseio.com/');
    $scope.messages = $firebaseArray(ref);
    $rootScope.$on('timerfinished', startBreak);
    function startBreak() {
      console.log('Break should start now');
    }
  };
  
  angular
    .module('aDoro')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$firebaseArray', HomeCtrl]);
})();