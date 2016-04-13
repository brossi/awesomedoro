(function() {
  var TaskCtrl = function TaskCtrl($rootScope, $scope, $firebaseArray, $filter, $timeout) { 

    var TMPSessionTasks = [];
    $scope.$parent.sessions.data = [];
    $scope.working = {
      on: false
    }
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

    $scope.addTodo = function addTodo() {
        $scope.todos.$add({
          title: $scope.newTodoTitle,
          created_at: getUnixTimestamp(),
          priority: $scope.newTodoPriority.name || 'urgent',
          status: 'planned',
          completed_at: null
        }).then(function(response) {
          // this is needed to update the DOM correctly after a new record is added; 
          // it shouldn't be, but all previou attempts to work around it have been unsuccessful
          $timeout(function() {
            $rootScope.safeApply();
          }, 1000);
        });
      // clean up the original submission form
        $scope.newTodoTitle = null; 
    };

    $scope.priorities = [
      { name: 'Important' },
      { name: 'Urgent' }
    ];
    $scope.newTodoPriority = $scope.priorities[0];

    var withinRange = function withinRange(item, show) {
      var currentTime = getUnixTimestamp();
      var latest, earliest;
      var val = item['created_at'];
      var range = show || 'all';
      switch(range) {
        case 'recent':
            // show todos newer than one hour (in seconds)
            latest = currentTime;
            earliest = currentTime - 300; //DEBUG
            break;
        case 'archived':
            // show todos older than one hour (in seconds)
            latest = currentTime - 300; //DEBUG
            earliest = 0;
            break;
        case 'all':
        default:
            latest = currentTime;
            earliest = 0;
      }
      if (val < latest && val > earliest) {
        return true;
      } 
      else {
        return false;
      }
    };

    var checkTodoStatus = function checkTodoStatus(item) {
      var todoStatus = item['status'];
      return todoStatus;
    };

    $scope.isRecentTodo = function isRecentTodo(item) {
      if (checkTodoStatus(item) === 'planned') {
        return withinRange(item, 'recent');
      }
    };

    $scope.isArchivedTodo = function isArchivedTodo(item) {
      if (checkTodoStatus(item) === 'planned') {
        return withinRange(item, 'archived');
      }
    };

    $scope.isCompletedTodo = function isCompletedTodo(item) {
      if (checkTodoStatus(item) === 'completed') {
        return withinRange(item, 'all');
      }
    };

    var checkTimerState = function checkTimerState() {
      var isTimerRunning = $scope.$parent.isTimerRunning.data;
      return isTimerRunning;
    };

    var sendTaskUpdates = function sendTaskUpdates(){
      console.log('WorkSessionRecorded');
      $scope.$parent.sessions.data.tasks = TMPSessionTasks;
      console.log($scope.$parent.sessions.data);
    };

    var preventWorkDuringBreak = function preventWorkDuringBreak() {
      // set value to check against so tasks cannot be started or completed during a break session
      $scope.break.on = true;
    };

    var enableWorkAfterBreak = function enableWorkAfterBreak() {
      // counter operation for re-enabling the ability to start/complete tasks during a sessions
      $scope.break.on = false;
    };

    $scope.startTimer = function($scope, $element, $attributes) {
      var isTimerRunning = checkTimerState();
      if (isTimerRunning == false) {
        $timeout(function() {
          // trigger click on timer start button
          angular.element(document.querySelector('#timerStartBtn')).triggerHandler('click');
        }, 100);
      } else {
        console.log('timer is already running');
      }
      // set new scope state to change the button on the task that triggered it
      $element.startBtn = false;
      $element.completeBtn = true;
      var taskStarted = {id: $element.$id, started_at: getUnixTimestamp()};
      TMPSessionTasks.push(taskStarted);
    };

    $scope.markComplete = function markComplete(item) {
      // set the completion time
      item['completed_at'] = getUnixTimestamp();
      // set status
      item['status'] = 'completed';

      // var todoCount = TMPSessionTasks.length;
      // for (i = 0; i < todoCount; i++) { 
      //   if (TMPSessionTasks[i]['id'] === selectedTaskID) {
      //     TMPSessionTasks[i]['completed_at'] = getUnixTimestamp();
      //     TMPSessionTasks[i]['status'] = 'completed';
      //   }
      // }
    };

    $scope.reActivateTodo = function reActivateTodo(item) {
      // unset the completion time
      item['completed_at'] = null;
      // set status
      item['status'] = 'planned';
    }

    $rootScope.$on('WorkSessionRecorded', sendTaskUpdates);
    $rootScope.$on('TIMER_FINISHED:work', preventWorkDuringBreak);
    $rootScope.$on('TIMER_FINISHED:break', enableWorkAfterBreak);

  };

  angular
    .module('aDoro')
    .controller('TaskCtrl', ['$rootScope', '$scope', '$firebaseArray', '$filter', '$timeout', TaskCtrl]);
})();