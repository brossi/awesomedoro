(function() {
  function config($stateProvider, $locationProvider) {
    $locationProvider
      .html5Mode({
        enabled: true,
        requireBase: false
    });
    
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/templates/home.html'
      })
      .state('work', {
        url: '/work',
        templateUrl: '/templates/work.html'
      })
      .state('task', {
        url: '/task',
        templateUrl: '/templates/task.html'
      })
  };
  
  angular
    .module('aDoro', ['ui.router', 'firebase', 'ngMaterial'])
    .config(config)
    .constant('appConstants', {
      // timer durations (in minutes)
      WORK_SESSION: 25,
      BREAK_SESSION: 5,
      LONG_BREAK_SESSION: 30
    });
})();