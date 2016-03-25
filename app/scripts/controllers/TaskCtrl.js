(function() {
  var TaskCtrl = function TaskCtrl($scope, $firebaseArray) { 
    var ref = new Firebase('https://awesomedoro.firebaseio.com/tasks');
    // create a synchronized array
    $scope.messages = $firebaseArray(ref);
    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.addMessage = function() {
      $scope.messages.$add({
        text: $scope.newMessageText
      });
    };
  };

  angular
    .module('aDoro')
    .controller('TaskCtrl', ['$scope', '$firebaseArray', TaskCtrl]);
})();