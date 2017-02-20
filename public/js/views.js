angular.module('genoscript').config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      controller: 'homeController',
      templateUrl: './../views/home.html'
    });


$urlRouterProvider
  .otherwise('/')

});