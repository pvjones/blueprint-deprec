'use strict';

(function () {

  'use strict';

  angular.module('app', ['ui.router', 'ngDropdowns']).config(config);

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
    }).state('all-results', {
      url: '/summary/all-results',
      controller: 'SummaryController',
      templateUrl: './../views/all-results.html',
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

  angular.module('app').controller('categoryTableController', categoryTableController);

  function categoryTableController() {

    this.colorResult = function (resultObj) {
      var color = "";

      if (resultObj.resulttype == "Inherited Conditions" && resultObj.resultbool == false) {
        color = "green";
      } else if (resultObj.resultqual == "positive" && resultObj.resultbool == true) {
        color = "green";
      } else if (resultObj.resultqual == "positive" && resultObj.resultbool == false) {
        color = "yellow";
      } else if (resultObj.resultqual == "negative" && resultObj.resultbool == false) {
        color = "yellow";
      } else if (resultObj.resultqual == "negative" && resultObj.resultbool == true) {
        color = "red";
      } else {
        color = "black";
      }

      return color;
    };
  };
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
      if (scroll >= 100) sticky.addClass('fixed');else sticky.removeClass('fixed');
    });
  } // END OF CTRL FUNC
})(); // END OF IIFE
'use strict';

(function () {

  angular.module('app').controller('StartController', StartController);

  function StartController($scope, $state, UploadService, user) {

    $scope.username = user.userName;

    $scope.uploadGenomeTXT = function (TXT, genomeName) {
      if (TXT && $scope.genomeName) {
        $scope.showUpload = true;
        UploadService.sendGenomeTXT(TXT, genomeName).then(function (response) {
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

  function SummaryController($scope, $state, user, ResultsService, ZygousityService, $filter) {

    $scope.userName = user.userName;
    $scope.userId = user.userId;
    $scope.ddSelectSelected = {
      display: 'No Genomes Uploaded'
    };

    $scope.$watch('ddSelectSelected', function (ddSelectSelected) {
      console.log("SELECTED GENOME", ddSelectSelected);
    });

    var getGenomeResults = function getGenomeResults(userId) {
      return ResultsService.getResultsByUserId(userId).then(function (response) {
        return response;
      }).catch(function (err) {
        return console.log(err);
      });
    };

    getGenomeResults($scope.userId).then(function (response) {
      var cleansedResponse = response.map(function (elem, index, array) {
        var cleansedGenome = elem;
        cleansedGenome.genomeresults.map(function (elem, index, array) {
          return ZygousityService.handleZygousity(elem.resultsArray);
        });
        return cleansedGenome;
      });
      return cleansedResponse;
    }).then(function (response) {
      $scope.userGenomeArray = transformData(response);
      $scope.ddSelectOptions = $scope.userGenomeArray;
      $scope.ddSelectSelected = $scope.userGenomeArray[0];
    }).catch(function (err) {
      console.log(err);
    });

    function transformData(response) {
      if (response) {
        return response.map(function (elem) {
          elem.display = 'GENOME:\xa0\xa0\xa0' + elem.genomename + "\xa0\xa0\xa0" + $filter('date')(new Date(elem.genomedate), 'short');
          return elem;
        });
      }
    }
  }; // END OF CTRL FUNC
})(); // END OF IIFE
'use strict';

(function () {

  angular.module('app').directive('summaryCategoryTable', summaryCategoryTable);

  function summaryCategoryTable() {

    return {
      restrict: 'E',
      templateUrl: 'js/directives/templates/summary-category-table.html',
      scope: {
        data: '='
      },
      bindToController: true,
      controller: 'categoryTableController',
      controllerAs: 'ctrl'
    };
  };
})();
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
      //console.log("service userId", userId)
      return $http({
        method: 'GET',
        url: '/api/results/' + userId
      }).then(function (response) {
        //console.log('valid response from $http', response)
        return response.data;
      }).catch(function (err) {
        console.log(err);
        throw new Error(err);
      });
    };
  }; // END OF SVC FUNC
})(); // END OF IIFE
'use strict';

(function () {
  angular.module('app').service('UploadService', UploadService);

  function UploadService($http, $q) {

    this.sendGenomeTXT = function (uploadTXT, genomeName) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: '/api/upload',
        data: {
          file: uploadTXT,
          genomeName: genomeName
        }
      }).then(function (res) {
        deferred.resolve(res.data);
      }).catch(function (res) {
        deferred.reject(res);
      });
      return deferred.promise;
    };
  } //END OF SVC FUNC
})(); //END OF IIFE
'use strict';

(function () {

  angular.module('app').service('ZygousityService', ZygousityService);

  function ZygousityService() {

    this.handleZygousity = function (categoryArray) {
      var cleansedArray = categoryArray;

      for (var i = cleansedArray.length - 1; i >= 0; i--) {
        if (cleansedArray[i].resultbool === false) {
          for (var j = cleansedArray.length - 1; j >= 0; j--) {
            if (cleansedArray[j].resultname == cleansedArray[i].resultname && cleansedArray[j].resultbool === true) {
              cleansedArray.splice(i, 1);
              break;
            }
          }
        }
      }

      return cleansedArray;
    };
  };
})();
'use strict';

/**
 * @license MIT http://jseppi.mit-license.org/license.html
 */
(function (window, angular) {
  'use strict';

  var dd = angular.module('ngDropdowns', []);

  dd.run(['$templateCache', function ($templateCache) {
    $templateCache.put('ngDropdowns/templates/dropdownSelect.html', ['<div ng-class="{\'disabled\': dropdownDisabled}" class="wrap-dd-select" tabindex="0">', '<span class="selected">{{dropdownModel[labelField]}}</span>', '<ul class="dropdown">', '<li ng-repeat="item in dropdownSelect"', ' class="dropdown-item"', ' dropdown-select-item="item"', ' dropdown-item-label="labelField">', '</li>', '</ul>', '</div>'].join(''));

    $templateCache.put('ngDropdowns/templates/dropdownSelectItem.html', ['<li ng-class="{divider: (dropdownSelectItem.divider && !dropdownSelectItem[dropdownItemLabel]), \'divider-label\': (dropdownSelectItem.divider && dropdownSelectItem[dropdownItemLabel])}">', '<a href="" class="dropdown-item"', ' ng-if="!dropdownSelectItem.divider"', ' ng-href="{{dropdownSelectItem.href}}"', ' ng-click="selectItem()">', '{{dropdownSelectItem[dropdownItemLabel]}}', '</a>', '<span ng-if="dropdownSelectItem.divider">', '{{dropdownSelectItem[dropdownItemLabel]}}', '</span>', '</li>'].join(''));

    $templateCache.put('ngDropdowns/templates/dropdownMenu.html', ['<ul class="dropdown">', '<li ng-repeat="item in dropdownMenu"', ' class="dropdown-item"', ' dropdown-item-label="labelField"', ' dropdown-menu-item="item">', '</li>', '</ul>'].join(''));

    $templateCache.put('ngDropdowns/templates/dropdownMenuItem.html', ['<li ng-class="{divider: dropdownMenuItem.divider, \'divider-label\': dropdownMenuItem.divider && dropdownMenuItem[dropdownItemLabel]}">', '<a href="" class="dropdown-item"', ' ng-if="!dropdownMenuItem.divider"', ' ng-href="{{dropdownMenuItem.href}}"', ' ng-click="selectItem()">', '{{dropdownMenuItem[dropdownItemLabel]}}', '</a>', '<span ng-if="dropdownMenuItem.divider">', '{{dropdownMenuItem[dropdownItemLabel]}}', '</span>', '</li>'].join(''));

    $templateCache.put('ngDropdowns/templates/dropdownMenuWrap.html', '<div class="wrap-dd-menu" ng-class="{\'disabled\': dropdownDisabled}"></div>');
  }]);

  dd.directive('dropdownSelect', ['DropdownService', function (DropdownService) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        dropdownSelect: '=',
        dropdownModel: '=',
        dropdownItemLabel: '@',
        dropdownOnchange: '&',
        dropdownDisabled: '='
      },

      controller: ['$scope', '$element', function ($scope, $element) {
        $scope.labelField = $scope.dropdownItemLabel || 'text';

        DropdownService.register($element);

        this.select = function (selected) {
          if (!angular.equals(selected, $scope.dropdownModel)) {
            $scope.dropdownModel = selected;
          }
          $scope.dropdownOnchange({
            selected: selected
          });
          $element[0].blur(); //trigger blur to clear active
        };

        $element.bind('click', function (event) {
          event.stopPropagation();
          if (!$scope.dropdownDisabled) {
            DropdownService.toggleActive($element);
          }
        });

        $scope.$on('$destroy', function () {
          DropdownService.unregister($element);
        });
      }],
      templateUrl: 'ngDropdowns/templates/dropdownSelect.html'
    };
  }]);

  dd.directive('dropdownSelectItem', [function () {
    return {
      require: '^dropdownSelect',
      replace: true,
      scope: {
        dropdownItemLabel: '=',
        dropdownSelectItem: '='
      },

      link: function link(scope, element, attrs, dropdownSelectCtrl) {
        scope.selectItem = function () {
          if (scope.dropdownSelectItem.href) {
            return;
          }
          dropdownSelectCtrl.select(scope.dropdownSelectItem);
        };
      },

      templateUrl: 'ngDropdowns/templates/dropdownSelectItem.html'
    };
  }]);

  dd.directive('dropdownMenu', ['$parse', '$compile', 'DropdownService', '$templateCache', function ($parse, $compile, DropdownService, $templateCache) {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        dropdownMenu: '=',
        dropdownModel: '=',
        dropdownItemLabel: '@',
        dropdownOnchange: '&',
        dropdownDisabled: '='
      },

      controller: ['$scope', '$element', function ($scope, $element) {
        $scope.labelField = $scope.dropdownItemLabel || 'text';

        var $template = angular.element($templateCache.get('ngDropdowns/templates/dropdownMenu.html'));
        // Attach this controller to the element's data
        $template.data('$dropdownMenuController', this);

        var tpl = $compile($template)($scope);
        var $wrap = $compile(angular.element($templateCache.get('ngDropdowns/templates/dropdownMenuWrap.html')))($scope);

        $element.replaceWith($wrap);
        $wrap.append($element);
        $wrap.append($template);

        DropdownService.register(tpl);

        this.select = function (selected) {
          if (!angular.equals(selected, $scope.dropdownModel)) {
            $scope.dropdownModel = selected;
          }
          $scope.dropdownOnchange({
            selected: selected
          });
        };

        $element.bind('click', function (event) {
          event.stopPropagation();
          if (!$scope.dropdownDisabled) {
            DropdownService.toggleActive(tpl);
          }
        });

        $scope.$on('$destroy', function () {
          DropdownService.unregister(tpl);
        });
      }]
    };
  }]);

  dd.directive('dropdownMenuItem', [function () {
    return {
      require: '^dropdownMenu',
      replace: true,
      scope: {
        dropdownMenuItem: '=',
        dropdownItemLabel: '='
      },

      link: function link(scope, element, attrs, dropdownMenuCtrl) {
        scope.selectItem = function () {
          if (scope.dropdownMenuItem.href) {
            return;
          }
          dropdownMenuCtrl.select(scope.dropdownMenuItem);
        };
      },

      templateUrl: 'ngDropdowns/templates/dropdownMenuItem.html'
    };
  }]);

  dd.factory('DropdownService', ['$document', function ($document) {
    var body = $document.find('body'),
        service = {},
        _dropdowns = [];

    body.bind('click', function () {
      angular.forEach(_dropdowns, function (el) {
        el.removeClass('active');
      });
    });

    service.register = function (ddEl) {
      _dropdowns.push(ddEl);
    };

    service.unregister = function (ddEl) {
      var index;
      index = _dropdowns.indexOf(ddEl);
      if (index > -1) {
        _dropdowns.splice(index, 1);
      }
    };

    service.toggleActive = function (ddEl) {
      angular.forEach(_dropdowns, function (el) {
        if (el !== ddEl) {
          el.removeClass('active');
        }
      });

      ddEl.toggleClass('active');
    };

    service.clearActive = function () {
      angular.forEach(_dropdowns, function (el) {
        el.removeClass('active');
      });
    };

    service.isActive = function (ddEl) {
      return ddEl.hasClass('active');
    };

    return service;
  }]);
})(window, window.angular);
//# sourceMappingURL=public/bundle.js.map
