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

    $scope.addTodo = function() {
        $scope.todos.$add({
          title: $scope.newTodoTitle,
          created_at: getUnixTimestamp(),
          priority: $scope.newTodoPriority.name || 'urgent',
          status: 'planned'
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

    $scope.isRecentTodo = function isRecentTodo(item) {
      return withinRange(item, 'recent');
    };
    $scope.isArchivedTodo = function isArchivedTodo(item) {
      return withinRange(item, 'archived');
    }

    $scope.newTodoPriority = $scope.priorities[0];

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

    $scope.startTimer = function ($scope, $element, $attributes) {
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

    $scope.markComplete = function(item) {
      var selectedTaskID = item.$id;
      var todoCount = TMPSessionTasks.length;
      for (i = 0; i < todoCount; i++) { 
        if (TMPSessionTasks[i]['id'] === selectedTaskID) {
          TMPSessionTasks[i]['completed_at'] = getUnixTimestamp();
        }
      }
    };

    $rootScope.$on('WorkSessionRecorded', sendTaskUpdates);
    $rootScope.$on('TIMER_FINISHED:work', preventWorkDuringBreak);
    $rootScope.$on('TIMER_FINISHED:break', enableWorkAfterBreak);

  };

  angular
    .module('aDoro')
    .controller('TaskCtrl', ['$rootScope', '$scope', '$firebaseArray', '$filter', '$timeout', TaskCtrl]);
})();