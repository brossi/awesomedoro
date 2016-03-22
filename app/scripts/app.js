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
        controller: 'HomeCtrl as home',
        templateUrl: '/templates/home.html'
      })
  };
  
  angular
    .module('aDoro', ['ui.router', 'firebase'])
    .config(config)
    .constant('appConstants', {
      // timer durations (in minutes)
      WORK_SESSION: 25,
      BREAK_SESSION: 5
    });
})();