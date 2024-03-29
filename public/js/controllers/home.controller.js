(function() {
  angular
    .module('app')
    .controller('HomeController', HomeController)

  function HomeController($scope, user) {

    // Auth
    console.log("user object returned", user)
    $scope.userName = user.userName;
    $scope.isAuthed = user.isAuthed;

    // Parallax scroll effects
    $(window).on('scroll', function() {
      var winScroll = $(this).scrollTop();

      $('.helix').css({
        'transform': 'translateY(-' + winScroll / 15 + '%)'
      });
      $('.helix-marks').css({
        'transform': 'translate(-' + winScroll / 7 + '%, -' + winScroll / 15 + '%)'
      });
      $('.circles-side').css({
        'transform': 'translateY(-' + winScroll / 15 + '%)'
      });
      $('.guanine').css({
        'transform': 'translateX(-' + winScroll / 15 + '%)'
      });
      $('.cytosine').css({
        'transform': 'translateX(+' + winScroll / 12 + '%)'
      });
    });

  } // END OF CTRL FUNC
})(); // END OF IIFE