(function() {

  angular
    .module('app')
    .controller('MenuController', MenuController)

  function MenuController($scope, $state, AuthService) {

    // Set initial display variables
    $scope.loggedIn = ($scope.loggedIn === true) ? true : false;

    function getUser() {

      AuthService.getUser()
        .then((res) => {
            $scope.userName = res.username;
            $scope.isAuthed = true;
          })
          .catch((err) => {
            $scope.isAuthed = false;
          });
    }

    getUser();

    $(window).scroll(function() {
      var sticky = $('.sticky'),
        scroll = $(window).scrollTop();
      if (scroll >= 100) sticky.addClass('fixed');
      else sticky.removeClass('fixed');
    });

  } // END OF CTRL FUNC
})(); // END OF IIFE