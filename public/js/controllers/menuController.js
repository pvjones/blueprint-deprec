(function() {

  angular
    .module('app')
    .controller('menuController', menuController)

  function menuController($scope, $state, authService) {

    function getUser() {

      authService.getUser()
        .then((res) => {
          $scope.username = res.username;
          $scope.loggedIn = true;
          console.log("menuController", $scope.username, $scope.loggedIn)
        },
        (err) => {
          $scope.username = null;
          $scope.loggedIn = false;
          console.log("menuController", $scope.username, $scope.loggedIn)
        });
    }

    getUser();



  }
})();