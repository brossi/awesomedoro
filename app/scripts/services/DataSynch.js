// (function() {
//   var DataSynch = function DataSynch($scope, $firebaseArray,) {
//     // connect with Firebase and download the app data to a local object
//     var ref = new Firebase('https://awesomedoro.firebaseio.com/tasks');
//     $scope.tasks = $firebaseArray(ref);
    
//       // add new items to the array
//       // the message is automatically added to our Firebase database!
//       $scope.addMessage = function() {
//         $scope.messages.$add({
//           text: $scope.newMessageText
//         });
//       };
//   };
  
//   angular
//     .module('aDoro')
//     .factory('DataSynch', ['$scope', '$firebaseArray', DataSynch]);
// })();