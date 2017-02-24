'use strict';

(function () {

  'use strict';

  angular.module('app', ['ui.router']).config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeController',
      templateUrl: './../views/home.html',
      resolve: {
        user: function user(AuthService, $state) {

          return AuthService.getUser().then(function (response) {
            var currentUser = {
              userId: response.userid,
              userName: response.username,
              isAuthed: true
            };
            return currentUser;
          }).catch(function (error) {
            var currentUser = {
              isAuthed: false
            };
            return currentUser;
          });
        }
      }
    }).state('start', {
      url: '/start',
      controller: 'StartController',
      templateUrl: './../views/start.html',
      resolve: {
        user: function user(AuthService, $state) {

          return AuthService.getUser().then(function (response) {
            var currentUser = {
              userId: response.userid,
              userName: response.username,
              isAuthed: true
            };
            return currentUser;
          }).catch(function (error) {
            var currentUser = {
              isAuthed: false
            };
            $state.go('home');
            return currentUser;
          });
        }
      }
    }).state('summary', {
      url: '/summary',
      controller: 'SummaryController',
      templateUrl: './../views/summary.html',
      resolve: {
        user: function user(AuthService, $state) {

          return AuthService.getUser().then(function (response) {
            var currentUser = {
              userId: response.userid,
              userName: response.username,
              isAuthed: true
            };
            return currentUser;
          }).catch(function (error) {
            var currentUser = {
              isAuthed: false
            };
            $state.go('home');
            return currentUser;
          });
        }
      }
    });

    $urlRouterProvider.otherwise('/home');
  }
})();
'use strict';

(function () {
  angular.module('app').controller('HomeController', HomeController);

  function HomeController($scope, user) {

    // Auth
    console.log("user object returned", user);
    $scope.userName = user.userName;
    $scope.isAuthed = user.isAuthed;

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
  } // END OF CTRL FUNC
})(); // END OF IIFE
'use strict';

(function () {

  angular.module('app').controller('MenuController', MenuController);

  function MenuController($scope, $state, AuthService) {

    // Set initial display variables
    $scope.loggedIn = $scope.loggedIn === true ? true : false;

    function getUser() {

      AuthService.getUser().then(function (res) {
        $scope.userName = res.username;
        $scope.isAuthed = true;
      }).catch(function (err) {
        $scope.isAuthed = false;
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

  angular.module('app').controller('StartController', StartController);

  function StartController($scope, $state, UploadService, user) {

    $scope.username = user.userName;

    $scope.uploadGenomeTXT = function (TXT) {
      $scope.showUpload = true;
      if (TXT) {

        UploadService.sendGenomeTXT(TXT).then(function (response) {
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
  angular.module('app').controller('SummaryController', SummaryController);

  function SummaryController($scope, $state, user, ResultsService) {

    $scope.userName = user.userName;
    $scope.userId = user.userId;

    var getGenomeResults = function getGenomeResults(userId) {
      console.log('FIRED');
      ResultsService.getResultsByUserId(userId).then(function (response) {
        console.log(response);
        return ResultsService.cleanseGenotypeResults(response);
      }).then(function (response) {
        console.log(response);
        return response; ////////////////////
      }).catch(function (err) {
        return console.log(err);
      });
    };

    getGenomeResults($scope.userId).then(function (response) {
      console.log(response);
    }).catch(function (err) {
      console.log(err);
    });
  } // END OF CTRL FUNC
})(); // END OF IIFE
'use strict';

(function () {
  'use strict';

  angular.module('app').directive('onReadFile', onReadFile);

  function onReadFile($parse) {

    return {
      restrict: 'A',
      scope: false,
      link: function link(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);
        element.on('change', function (onChangeEvent) {
          var reader = new FileReader();
          reader.onload = function (onLoadEvent) {
            scope.$apply(function () {
              fn(scope, {
                $fileContent: onLoadEvent.target.result
              });
            });
          };
          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  };
})();
'use strict';

(function () {
  angular.module('app').service('AuthService', AuthService);

  function AuthService($http) {

    this.getUser = function () {
      return $http({
        method: 'GET',
        url: '/api/auth/user'
      }).then(function (response) {
        return response.data[0];
      }).catch(function (err) {
        throw new Error(err);
      });
    };
  }
})();
'use strict';

(function () {
  angular.module('app').service('ResultsService', ResultsService);

  function ResultsService($http) {

    this.getResultsByUserId = function (userId) {
      console.log("service userId", userId);
      return $http({
        method: 'GET',
        url: '/api/results/' + userId
      }).then(function (response) {
        console.log(response);
        return response.data;
      }).catch(function (err) {
        console.log(err);
        throw new Error(err);
      });
    };

    this.cleanseGenotypeResults = function (genotypeResultsObject) {
      return genotypeResultsObject; ////////////////
    };
  }; // END OF SVC FUNC
})(); // END OF IIFE
'use strict';

(function () {
  angular.module('app').service('UploadService', UploadService);

  function UploadService($http, $q) {

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
