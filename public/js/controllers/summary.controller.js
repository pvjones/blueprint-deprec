(function() {
  angular
    .module('app')
    .controller('SummaryController', SummaryController)

  function SummaryController($scope, $state, user, ResultsService, $filter) {

    $scope.userName = user.userName;
    $scope.userId = user.userId;

    $scope.$watch('ddSelectSelected', (ddSelectSelected) => {
      console.log("ALL GENOMES", $scope.userGenomeArray)
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
        $scope.userGenomeArray = transformData(response);
        $scope.ddSelectOptions = $scope.userGenomeArray;
        $scope.ddSelectSelected = $scope.userGenomeArray[0];
        console.log()
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

  }; // END OF CTRL FUNC
})(); // END OF IIFE
