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
        controller: 'HomeController',
        templateUrl: './../views/home.html',
        resolve: {
          user: (AuthService, $state) => {

            return AuthService.getUser()
                .then((response) => {
                  let currentUser = {
                    userId: response.userid,
                    userName: response.username,
                    isAuthed: true
                  }
                  return currentUser
                })
                .catch((error) => {
                  let currentUser = {
                    isAuthed: false
                  }
                  return currentUser
                });
          }
        }
      })
      .state('start', {
        url: '/start',
        controller: 'StartController',
        templateUrl: './../views/start.html',
        resolve: {
          user: (AuthService, $state) => {

            return AuthService.getUser()
                .then((response) => {
                  let currentUser = {
                    userId: response.userid,
                    userName: response.username,
                    isAuthed: true
                  }
                  return currentUser
                })
                .catch((error) => {
                  let currentUser = {
                    isAuthed: false
                  }
                  $state.go('home')
                  return currentUser
                });
          }
        }
      })
      .state('summary', {
        url: '/summary',
        controller: 'SummaryController',
        templateUrl: './../views/summary.html',
        resolve: {
          user: (AuthService, $state) => {

            return AuthService.getUser()
                .then((response) => {
                  let currentUser = {
                    userId: response.userid,
                    userName: response.username,
                    isAuthed: true
                  }
                  return currentUser
                })
                .catch((error) => {
                  let currentUser = {
                    isAuthed: false
                  }
                  $state.go('home')
                  return currentUser
                });
          }
        }
      });

    $urlRouterProvider.otherwise('/home');
  }

})();