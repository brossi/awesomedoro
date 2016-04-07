(function() {
  var TaskCtrl = function TaskCtrl($rootScope, $scope, $firebaseArray, $filter, $timeout) { 

    var TMPSessionTasks = [];
    $scope.$parent.sessions.data = [];
    $scope.break = {
      on: false
    }

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

    $scope.newTodoPriority = $scope.priorities[0];

    var checkTimerState = function checkTimerState() {
      var isTimerRunning = $scope.$parent.isTimerRunning.data;
      return isTimerRunning;
    };

    var sendTaskUpdates = function sendTaskUpdates(){
      console.log('WorkSessionRecorded');
      $scope.$parent.sessions.data.tasks = TMPSessionTasks;
      console.log($scope.$parent.sessions.data);

      //$scope.$parent.sessions.data.tasks.push(TMPSessionTasks);
      //$scope.$parent.sessions.data.tasks = TMPSessionTasks;
    };

    var preventWorkDuringBreak = function preventWorkDuringBreak() {
      // set value to check against so tasks cannot be started or completed during a break session
      $scope.break.on = true;
    };

    var enableWorkAfterBreak = function enableWorkAfterBreak() {
      $scope.break.on = false;
      console.log('breakEnded');
    };

    $scope.startTimer = function ($scope, $element, $attributes) {
      var isTimerRunning = checkTimerState();
      if (isTimerRunning == false) {
        $timeout(function() {
          // trigger click on timer start button
          angular.element(document.querySelector('#timerStartBtn')).triggerHandler('click');
          // set new scope state to change the button on the task that triggered it
          $element.startBtn = false;
          $element.completeBtn = true;
          var taskStarted = {id: $element.$id, completed: false};
          TMPSessionTasks.push(taskStarted);
          console.log(taskStarted);
        }, 100);
      } else {
        console.log('timer is already running');
      }
    };

    $scope.markComplete = function(item) {
      console.log(item.$id);
    };

    $rootScope.$on('WorkSessionRecorded', sendTaskUpdates);
    $rootScope.$on('TIMER_STARTED:break', preventWorkDuringBreak);
    $rootScope.$on('TIMER_FINISHED:break', enableWorkAfterBreak);

  };

  angular
    .module('aDoro')
    .controller('TaskCtrl', ['$rootScope', '$scope', '$firebaseArray', '$filter', '$timeout', TaskCtrl]);
})();