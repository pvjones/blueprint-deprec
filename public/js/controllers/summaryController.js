(function () {
  angular
   .module('app')
   .controller('summaryController', summaryController);

  function summaryController($scope, $state, authService, user) {

    $scope.username = user.userName;
    $scope.userid = user.userId;

  } // END OF CTRL FUNC
  
})(); // END OF IIFE