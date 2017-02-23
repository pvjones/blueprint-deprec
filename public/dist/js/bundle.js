'use strict';

(function () {

  'use strict';

  angular.module('app', ['ui.router']).config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      url: '/home',
      controller: 'homeController',
      templateUrl: './../views/home.html',
      resolve: {
        user: function user(authService, $state) {
          var userObj = {};

          return authService.getUser().then(function (response) {
            if (!response) {
              console.log('no response in .state resolve');
              userObj.isAuthed = false;
            } else {
              userObj.userId = response.userid, userObj.userName = response.username, userObj.isAuthed = true;
            }
            return userObj;
          }).catch(function (err) {
            console.log('catch err in .state resolve', err);
            userObj.isAuthed = false;
            return userObj;
          });
        }
      }
    }).state('start', {
      url: '/start',
      controller: 'startController',
      templateUrl: './../views/start.html',
      resolve: {
        user: function user(authService, $state) {
          var userObj = {};

          return authService.getUser().then(function (response) {
            if (!response) {
              console.log('no response in .state resolve');
              userObj.isAuthed = false;
              $state.go('home');
            } else {
              userObj.userId = response.userid, userObj.userName = response.username, userObj.isAuthed = true;
            }
            return userObj;
          }).catch(function (err) {
            console.log('catch err in .state resolve', err);
            $state.go('home');
          });
        }
      }
    }).state('summary', {
      url: '/summary',
      controller: 'summaryController',
      templateUrl: './../views/summary.html',
      resolve: {
        user: function user(authService, $state, $rootScope) {
          var userObj = {};

          return authService.getUser().then(function (response) {
            if (!response) {
              console.log('no response in .state resolve');
              userObj.isAuthed = false;
              $state.go('home');
            } else {
              userObj.userId = response.userid, userObj.userName = response.username, userObj.isAuthed = true;
            }
            return userObj;
          }).catch(function (err) {
            console.log('catch err in .state resolve', err);
            $state.go('home');
          });
        }
      }
    });

    $urlRouterProvider.otherwise('/home');
  }
})();
'use strict';

(function () {
  'use strict';

  var app = angular.module('app');

  app.directive('onReadFile', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function link(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);
        element.on('change', function (onChangeEvent) {
          var reader = new FileReader();
          reader.onload = function (onLoadEvent) {
            scope.$apply(function () {
              fn(scope, { $fileContent: onLoadEvent.target.result });
            });
          };
          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  });
})();
'use strict';

angular.module('app').controller('homeController', function ($scope, user) {

  // Auth
  $scope.userName = user.userName;
  $scope.isAuthed = user.isAuthed;

  console.log($scope.isAuthed);

  // Parallax scroll effects
  $(window).on('scroll', function () {
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
});
'use strict';

(function () {

  angular.module('app').controller('menuController', menuController);

  function menuController($scope, $state, authService) {

    // Set initial display variables
    $scope.loggedIn = $scope.loggedIn === true ? true : false;

    function getUser() {

      authService.getUser().then(function (res) {
        $scope.username = res.username;
        $scope.loggedIn = true;
        console.log("menuController", $scope.username, $scope.loggedIn);
      }, function (err) {
        $scope.username = null;
        $scope.loggedIn = false;
        console.log("menuController", $scope.username, $scope.loggedIn);
      });
    }

    getUser();

    $(window).scroll(function () {
      var sticky = $('.sticky'),
          scroll = $(window).scrollTop();
      if (scroll >= 80) sticky.addClass('fixed');else sticky.removeClass('fixed');
    });
  } // END OF CTRL FUNC
})(); // END OF IIFE
'use strict';

(function () {

  angular.module('app').controller('startController', startController);

  function startController($scope, $state, authService, uploadService, user) {

    $scope.username = user.userName;

    $scope.uploadGenomeTXT = function (TXT) {
      console.log("uploadGenomeTXT fired");
      if (TXT) {
        $scope.loadingMessage = "Uploading and converting your genotyping results";
        uploadService.sendGenomeTXT(TXT).then(function (response) {
          console.log(response);
          $state.go('summary');
        }, function (err) {
          return console.log(err);
        });
      }
    };
  } // END OF CONTROLLER FUNCTION
})(); // END OF IIFE
'use strict';

(function () {
  angular.module('app').controller('summaryController', summaryController);

  function summaryController($scope, $state, authService, user) {

    $scope.username = user.userName;
    $scope.userid = user.userId;
  } // END OF CTRL FUNC
})(); // END OF IIFE
'use strict';

(function () {
  angular.module('app').service('authService', authService);

  function authService($http) {

    this.getUser = function () {
      return $http({
        method: 'GET',
        url: '/api/auth/user'
      }).then(function (res) {
        console.log(res.data[0]);
        return res.data[0];
      });
    };
  }
})();
'use strict';

(function () {
  angular.module('app').service('uploadService', uploadService);

  function uploadService($http, $q) {

    this.sendGenomeTXT = function (uploadTXT) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/upload',
        data: { file: uploadTXT }
      }).then(function (res) {
        deferred.resolve(res.data);
      }).catch(function (res) {
        deferred.reject(res);
      });
      return deferred.promise;
    };
  } //END OF SVC FUNC
})(); //END OF IIFE
//# sourceMappingURL=public/bundle.js.map
