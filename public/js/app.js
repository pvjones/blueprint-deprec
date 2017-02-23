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
        templateUrl: './../views/home.html',
        resolve: {
          user: (authService, $state) => {
            let userObj = {}

            return authService.getUser()
              .then((response) => {
                if (!response) {
                  console.log('no response in .state resolve');
                  userObj.isAuthed = false;
                } else {
                  userObj.userId = response.userid,
                  userObj.userName = response.username,
                  userObj.isAuthed = true;
                }
                return userObj;
              })
              .catch((err) => {
                console.log('catch err in .state resolve', err);
                userObj.isAuthed = false;
                return userObj;
              })
          }
        }
      })
      .state('start', {
        url: '/start',
        controller: 'startController',
        templateUrl: './../views/start.html',
        resolve: {
          user: (authService, $state) => {
            let userObj = {}

            return authService.getUser()
              .then((response) => {
                if (!response) {
                  console.log('no response in .state resolve');
                  userObj.isAuthed = false
                  $state.go('home');
                } else {
                  userObj.userId = response.userid,
                  userObj.userName = response.username,
                  userObj.isAuthed = true;
                }
                return userObj;
              })
              .catch((err) => {
                console.log('catch err in .state resolve', err);
                $state.go('home')
              })
          }
        }
      })
      .state('summary', {
        url: '/summary',
        controller: 'summaryController',
        templateUrl: './../views/summary.html',
        resolve: {
          user: (authService, $state, $rootScope) => {
            let userObj = {}

            return authService.getUser()
              .then((response) => {
                if (!response) {
                  console.log('no response in .state resolve');
                  userObj.isAuthed = false
                  $state.go('home');
                } else {
                  userObj.userId = response.userid,
                  userObj.userName = response.username,
                  userObj.isAuthed = true;
                }
                return userObj;
              })
              .catch((err) => {
                console.log('catch err in .state resolve', err);
                $state.go('home')
              })
          }
        }
      });

    $urlRouterProvider.otherwise('/home');
  }

})();