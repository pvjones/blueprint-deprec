(function() {
  angular
    .module('app')
    .directive('genomeChart', genomeChart);

  function genomeChart() {

    return {
      restrict: 'E',
      scope: {
        data: '=',
        },
      controller: 'genomeChartController',
      bindToController: true,
      controllerAs: 'ctrl'
    }

  }
})();