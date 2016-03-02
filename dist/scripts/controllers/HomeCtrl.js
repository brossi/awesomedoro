(function() {
  var HomeCtrl = function HomeCtrl($scope, $firebaseArray) {
    var ref = new Firebase('https://awesomedoro.firebaseio.com/');
    $scope.messages = $firebaseArray(ref);
  };
  
  angular
    .module('aDoro')
    .controller('HomeCtrl', ['$scope', '$firebaseArray', HomeCtrl]);
})();