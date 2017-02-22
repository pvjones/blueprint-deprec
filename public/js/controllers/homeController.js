angular.module('app').controller('homeController', function($scope) {

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

  $(window).scroll(function() {
    var sticky = $('.sticky'),
      scroll = $(window).scrollTop();
    if (scroll >= 80) sticky.addClass('fixed');
    else sticky.removeClass('fixed');
  });

});