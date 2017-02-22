(function() {

  'use strict';

  angular
    .module('app', ['ui.router'])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'homeController',
        templateUrl: './../views/home.html'
      })
      .state('start', {
        url: '/start',
        controller: 'startController',
        templateUrl: './../views/start.html',
        resolve: {
          user: function(authService, $state) {
            return authService.getUser()
              .then(function(response) {
                if (!response) {
                  console.log('no response in .state resolve');
                  $state.go('home');
                }
                return response;
              })
              .catch(function(err) {
                console.log('catch err in .state resolve', err);
                $state.go('home');
              });
          }
        }
      });

    $urlRouterProvider.otherwise('/home');
  }

})();