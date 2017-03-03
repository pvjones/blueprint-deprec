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
    }).state('detail', {
      url: '/detail/:descriptionId',
      controller: 'detailController',
      templateUrl: './../views/detail.html',
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
'use strict';

(function () {

  angular.module('app').controller('categoryTableController', categoryTableController);

  function categoryTableController(FilterService) {

    this.FilterService = FilterService;

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
  angular.module('app').controller('detailController', detailController);

  function detailController($scope, $stateParams, DetailService) {

    getDetail($stateParams.descriptionId);

    function getDetail(descriptionId) {
      DetailService.getDetail(descriptionId).then(function (response) {
        $scope.detail = response;
        console.log('detailController', $scope.detail);
      }).catch(function (error) {
        console.log(error);
      });
    };
  };
})();
'use strict';

(function () {
  angular.module('app').controller('genomeChartController', genomeChartController);

  function genomeChartController(filterService) {}
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

  function SummaryController($scope, $state, user, ResultsService, ZygousityService, FilterService, $filter) {
    $scope.FilterService = FilterService;

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

    $scope.triggerFilter = function (filterName) {
      console.log('filterName', filterName);
      FilterService.setFilter(filterName);
    };
  }; // END OF CTRL FUNC
})(); // END OF IIFE
'use strict';

(function () {
  angular.module('app').directive('genomeChart', genomeChart);

  function genomeChart(ChartResizeService) {

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function link(scope, elem, attrs) {

        var chartElement = elem[0];

        var width = ChartResizeService.calculateElementWidth(chartElement);
        window.onresize = function (event) {
          width = ChartResizeService.calculateElementWidth(chartElement);
          updateChart();
        };

        var margins = {
          top: 5,
          left: 5,
          right: 5,
          bottom: 5
        };

        var height = 40 - margins.top - margins.bottom;

        var chromosomeRef = {
          1: 249250621,
          2: 243199373,
          3: 198022430,
          4: 191154276,
          5: 180915260,
          6: 171115067,
          7: 159138663,
          8: 146364022,
          9: 141213431,
          10: 135534747,
          11: 135006516,
          12: 133851895,
          13: 115169878,
          14: 107349540,
          15: 102531392,
          16: 90354753,
          17: 81195210,
          18: 78077248,
          19: 59128983,
          20: 63025520,
          21: 48129895,
          22: 51304566,
          23: 155270560
        };

        var dataset = [{

          data: [{
            id: 1,
            length: 249250621
          }],
          name: 'chromosome1'
        }, {
          data: [{
            id: 2,
            length: 243199373
          }],
          name: 'chromosome2'
        }, {
          data: [{
            id: 3,
            length: 198022430
          }],
          name: 'chromosome3'
        }, {
          data: [{
            id: 4,
            length: 191154276
          }],
          name: 'chromosome4'
        }, {
          data: [{
            id: 5,
            length: 180915260
          }],
          name: 'chromosome5'
        }, {
          data: [{
            id: 6,
            length: 171115067
          }],
          name: 'chromosome6'
        }, {
          data: [{
            id: 7,
            length: 159138663
          }],
          name: 'chromosome7'
        }, {
          data: [{
            id: 8,
            length: 146364022
          }],
          name: 'chromosome8'
        }, {
          data: [{
            id: 9,
            length: 141213431
          }],
          name: 'chromosome9'
        }, {
          data: [{
            id: 10,
            length: 135534747
          }],
          name: 'chromosome10'
        }, {
          data: [{
            id: 11,
            length: 135006516
          }],
          name: 'chromosome11'
        }, {
          data: [{
            id: 12,
            length: 133851895
          }],
          name: 'chromosome12'
        }, {
          data: [{
            id: 13,
            length: 115169878
          }],
          name: 'chromosome13'
        }, {
          data: [{
            id: 14,
            length: 107349540
          }],
          name: 'chromosome14'
        }, {
          data: [{
            id: 15,
            length: 102531392
          }],
          name: 'chromosome15'
        }, {
          data: [{
            id: 16,
            length: 90354753
          }],
          name: 'chromosome16'
        }, {
          data: [{
            id: 17,
            length: 81195210
          }],
          name: 'chromosome17'
        }, {
          data: [{
            id: 18,
            length: 78077248
          }],
          name: 'chromosome18'
        }, {
          data: [{
            id: 19,
            length: 59128983
          }],
          name: 'chromosome19'
        }, {
          data: [{
            id: 20,
            length: 63025520
          }],
          name: 'chromosome20'
        }, {
          data: [{
            id: 21,
            length: 48129895
          }],
          name: 'chromosome21'
        }, {
          data: [{
            id: 22,
            length: 51304566
          }],
          name: 'chromosome22'
        }, {
          data: [{
            id: 23,
            length: 155270560
          }],
          name: 'chromosome23'
        }];

        var dataset = dataset.map(function (d) {
          return d.data.map(function (e, i) {
            // Structure it so that your numeric
            // axis (the stacked amount) is y
            return {
              y: e.length,
              x: e.id
            };
          });
        });

        var stack = d3.layout.stack();

        stack(dataset);

        var dataset = dataset.map(function (group) {
          return group.map(function (d) {
            // Invert the x and y values, and y0 becomes x0
            return {
              x: d.y,
              y: d.x,
              x0: d.y0
            };
          });
        });

        scope.$watch("data", function (n, o) {
          if (n !== o) {
            updateChart();
          }
        });

        function updateChart() {

          d3.select(elem[0]).selectAll('svg').remove();

          var svg = d3.select(elem[0]).append('svg').attr('width', width + margins.left + margins.right).attr('height', height + margins.bottom + margins.top).append('g').attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

          var snpVals = [];

          scope.data.forEach(function (elem) {
            var position = 0;

            var chromosomeNums = [];
            for (var i = 1; i <= elem.chromosome; i++) {
              chromosomeNums.push(i);
            }
            chromosomeNums.forEach(function (elem) {
              position += chromosomeRef[elem];
            });
            position += +elem.position;
            snpVals.push(position);
          }); //END OF FOREACH

          var xMax = d3.max(dataset, function (group) {
            return d3.max(group, function (d) {
              return d.x + d.x0;
            });
          });

          var xScale = d3.scale.linear().domain([0, xMax]).range([0, width]);

          var colors = d3.scale.linear().domain([1, width / 20]).interpolate(d3.interpolateHcl).range([d3.rgb("#104f99"), d3.rgb('#f75050')]);

          var groups = svg.selectAll('g').data(dataset);

          groups.enter().append('g').style('fill', function (d, i) {
            return colors(i);
          }).attr('fill-opacity', 0.6).style('stroke', function (d, i) {
            return colors(i);
          }).style('stroke-width', 1);

          d3.selectAll('rect').remove();

          var rects = groups.selectAll('rect').data(function (d) {
            return d;
          });

          rects.enter().append('rect').attr('x', function (d) {
            return xScale(d.x0);
          }).attr('height', 30).attr('width', function (d) {
            return xScale(d.x) - 3;
          });

          rects.exit().remove();

          d3.selectAll('.snp-line').remove();
          snpVals.forEach(function (elem) {

            svg.append('rect').attr('fill', 'red').attr('width', 3).attr('height', 40).attr('x', xScale(elem)).attr('y', -5).classed('snp-line', true);
          });
        }
      } //end of link
    };
  };
})();
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
  angular.module('app').service('ChartResizeService', ChartResizeService);

  function ChartResizeService() {

    this.calculateElementWidth = function (element) {
      if (!element.offsetWidth) {
        return 0;
      }
      var style = window.getComputedStyle(element);
      var width = element.offsetWidth;
      return width;

      console.log(style);
    };
  };
})();
'use strict';

(function () {

  angular.module('app').service('DetailService', DetailService);

  function DetailService($http) {

    this.getDetail = function (descriptionId) {
      return $http({
        method: 'GET',
        url: '/api/getdetail/' + descriptionId
      }).then(function (response) {
        return response.data[0].detailobject;
      }).catch(function (error) {
        console.log(error);
        throw new Error(error);
      });
    };
  };
})();
'use strict';

(function () {

  angular.module('app').service('FilterService', FilterService);

  function FilterService() {
    this.filter = '';
    this.searchTerm = '';

    this.setFilter = function (filterName) {
      switch (filterName) {
        case 'search':
          if (this.searchTerm && this.searchTerm.length > 0) {
            this.filter = { resultname: this.searchTerm };
          }
          break;
        case 'healthAlert':
          this.filter = { resultbool: true, resultqual: 'negative' };
          break;
        default:
          this.filter = '';
      };
    };
  };
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

        if (cleansedArray[i]) {

          for (var j = i - 1; j >= 0; j--) {

            if (cleansedArray[j].resultname == cleansedArray[i].resultname && cleansedArray[j].resultbool === true) {
              cleansedArray.splice(i, 1);
              break;
            } else if (cleansedArray[j].resultname == cleansedArray[i].resultname && cleansedArray[i].resultbool === true) {
              cleansedArray.splice(j, 1);
              break;
            } else if (cleansedArray[j].resultname == cleansedArray[i].resultname && cleansedArray[i].resultbool === false && cleansedArray[j].resultbool === false) {
              cleansedArray.splice(j, 1);
              break;
            }
          }
        }
      }
      return cleansedArray;
    };
  };
})();
//# sourceMappingURL=public/bundle.js.map
