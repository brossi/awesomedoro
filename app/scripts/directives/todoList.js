(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name aDoro.directive:todoList
   * @description
   * # todo list component
   */
  var todoList = function todoList() {
    return {
      templateUrl: '/templates/directives/todo_list.html',
      replace: true,
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, element, attributes) {

      }
    };
  };

  angular.module('aDoro')
  .directive('todoList', todoList);
}());