(function() {
  angular
    .module('app')
    .controller('SummaryController', SummaryController)

  function SummaryController($scope, $state, user, ResultsService, ZygousityService, FilterService, $filter) {
    $scope.FilterService = FilterService;

    $scope.userName = user.userName;
    $scope.userId = user.userId;
    $scope.ddSelectSelected = {
      display: 'No Genomes Uploaded'
    }

    $scope.$watch('ddSelectSelected', (ddSelectSelected) => {
      console.log("SELECTED GENOME", ddSelectSelected)
    })

    let getGenomeResults = (userId) => {
      return ResultsService.getResultsByUserId(userId)
        .then((response) => {
          return response
        })
        .catch((err) => console.log(err))
    };

    getGenomeResults($scope.userId)
      .then((response) => {
        let cleansedResponse = response.map((elem, index, array) => {
          let cleansedGenome = elem;
          cleansedGenome.genomeresults.map((elem, index, array) => {
            return ZygousityService.handleZygousity(elem.resultsArray);
          })
          return cleansedGenome;
        })
        return cleansedResponse;
      })
      .then((response) => {
        $scope.userGenomeArray = transformData(response);
        $scope.ddSelectOptions = $scope.userGenomeArray;
        $scope.ddSelectSelected = $scope.userGenomeArray[0];
      })
      .catch((err) => {
        console.log(err)
      })

    function transformData(response) {
      if (response) {
        return response.map(elem => {
          elem.display = 'GENOME:\xa0\xa0\xa0' + elem.genomename + "\xa0\xa0\xa0" + $filter('date')(new Date(elem.genomedate), 'short');
          return elem;

        })
      }
    }

    $scope.triggerFilter = (filterName) => {
      console.log('filterName', filterName);
      FilterService.setFilter(filterName);
    }

  }; // END OF CTRL FUNC
})(); // END OF IIFE