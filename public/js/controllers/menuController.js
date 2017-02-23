(function() {

  angular
    .module('app')
    .controller('menuController', menuController)

  function menuController($scope, $state, authService) {

    // Set initial display variables
    $scope.loggedIn = ($scope.loggedIn === true) ? true : false;

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

    $(window).scroll(function() {
      var sticky = $('.sticky'),
        scroll = $(window).scrollTop();
      if (scroll >= 80) sticky.addClass('fixed');
      else sticky.removeClass('fixed');
    });

  } // END OF CTRL FUNC
})(); // END OF IIFE