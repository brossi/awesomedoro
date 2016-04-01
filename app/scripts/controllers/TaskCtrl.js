(function() {
  var TaskCtrl = function TaskCtrl($scope, $firebaseArray, $filter) { 

    var getUnixTimestamp = function getUnixTimestamp() {
      // generate a unix epoch timestamp (in seconds)
      return Math.floor(new Date() / 1000);
    }

    var ref = new Firebase('https://awesomedoro.firebaseio.com/todos');
    // create a synchronized array
    $scope.todos = $firebaseArray(ref);
    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.addTodo = function() {
      $scope.todos.$add({
        title: $scope.newTodoTitle,
        desc: $scope.newTodoDesc || 'description goes here',
        created_at: getUnixTimestamp(),
        priority: $scope.newTodoPriority.name || 'Urgent',
        due_date: $scope.newTodoDueDate || null,
        status: 'planned'
      });
      // clean up the original submission form
      $scope.newTodoTitle = null;
    };

    $scope.priorities = [
      { name: 'Important' },
      { name: 'Urgent' }
    ];

  };

  angular
    .module('aDoro')
    .controller('TaskCtrl', ['$scope', '$firebaseArray', '$filter', TaskCtrl]);
})();