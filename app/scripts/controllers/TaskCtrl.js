(function() {
  var TaskCtrl = function TaskCtrl($rootScope, $scope, $firebaseArray, $filter, $timeout, appConstants) { 

    var TMPSessionTasks = [];
    $scope.$parent.sessions.data = [];
    $scope.working = {on: false};
    $scope.break = {on: false};

    var getUnixTimestamp = function getUnixTimestamp() {
      // generate a unix epoch timestamp (in seconds)
      return Math.floor(new Date() / 1000);
    }

    var ref = new Firebase('https://awesomedoro.firebaseio.com/todos');
    // create a synchronized array
    $scope.todos = $firebaseArray(ref);
    // add new items to the array
    // the message is automatically added to our Firebase database!

    $scope.getStatusCount = function getStatusCount() {
      $scope.todos.$loaded(function(data) {
        var length = data.length;
        var active = 0;
        var expired = 0;
        var completed = 0;
        for (var i=0; i < length; i++) {
          var status = data[i]['status'];
          if (status === 'active') {
            active++;
          } else if (status === 'expired') {
            expired++;
          } else if (status === 'completed') {
            completed++;
          }
        }
        $scope.activeCount = active || 0;
        $scope.expiredCount = expired || 0;
        $scope.completedCount = completed || 0;
      });
    };
    $scope.getStatusCount();

    $scope.addTodo = function addTodo() {
        $scope.todos.$add({
          title: $scope.newTodoTitle,
          created_at: getUnixTimestamp(),
          priority: $scope.newTodoPriority.name || 'urgent',
          status: 'active',
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

    // method to check creation timestamp on todos and modulate the status
    $scope.processTodos = function processTodos(item) {
      var currentTime = getUnixTimestamp();
      var created = item['created_at'];
      var expired = currentTime - appConstants.EXPIRE_AFTER; //DEBUG
      // first check to see if the item is already completed, if it is,
      // leave the status as-is
      if (status !== 'completed') {
        // for todos that are older than the current expiration cutoff, set status
        if (created <= expired) {
          // change status
          item['status'] = 'expired';
        }
        // otherwise, leave the status alone
      }
      $scope.todos.$save(item);
    };

    $scope.showTodosFor = function showTodosFor(item, status) {
      $scope.processTodos(item);
      if (item['status'] === status) {
        return item;
      }
    };

    var checkTimerState = function checkTimerState() {
      var isTimerRunning = $scope.$parent.isTimerRunning.data;
      return isTimerRunning;
    };

    var sendTaskUpdates = function sendTaskUpdates(){
      //console.log('WorkSessionRecorded');
      $scope.$parent.sessions.data.tasks = TMPSessionTasks;
      //console.log($scope.$parent.sessions.data);
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
        //console.log('timer is already running');
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
      $scope.todos.$save(item);

      // var todoCount = TMPSessionTasks.length;
      // for (i = 0; i < todoCount; i++) { 
      //   if (TMPSessionTasks[i]['id'] === selectedTaskID) {
      //     TMPSessionTasks[i]['completed_at'] = getUnixTimestamp();
      //     TMPSessionTasks[i]['status'] = 'completed';
      //   }
      // }
    };

    $scope.reActivateTodo = function reActivateTodo(item) {
      item['status'] = 'active';
      item['created_at'] = getUnixTimestamp();
      $scope.todos.$save(item);
    };

    $scope.unCompleteTodo = function unCompleteTodo(item) {
      var currentTime = getUnixTimestamp();
      var created = item['created_at'];
      var expired = currentTime - appConstants.EXPIRE_AFTER; //DEBUG
      
      // reset to correct status
      if (created <= expired) {
        item['status'] = 'expired';
      } else {
        item['status'] = 'active';
      }
      // unset the completion time
      item['completed_at'] = null;
      $scope.todos.$save(item);

    }

    $rootScope.$on('WorkSessionRecorded', sendTaskUpdates);
    $rootScope.$on('TIMER_FINISHED:work', preventWorkDuringBreak);
    $rootScope.$on('TIMER_FINISHED:break', enableWorkAfterBreak);

  };

  angular
    .module('aDoro')
    .controller('TaskCtrl', ['$rootScope', '$scope', '$firebaseArray', '$filter', '$timeout', 'appConstants', TaskCtrl]);
})();