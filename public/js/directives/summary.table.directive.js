(function() {

  angular
    .module('app')
    .directive('summaryCategoryTable', summaryCategoryTable)

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
    }

  };
})();