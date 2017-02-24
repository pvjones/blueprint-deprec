(function () {
  angular
   .module('app')
   .controller('SummaryController', SummaryController)

  function SummaryController($scope, $state, user, ResultsService) {

    $scope.userName = user.userName;
    $scope.userId = user.userId;

    let getGenomeResults = (userId) => {
      console.log('FIRED')
      ResultsService.getResultsByUserId(userId)
        .then((response) => {
          console.log(response)
          return ResultsService.cleanseGenotypeResults(response);
        })
        .then((response) => {
          console.log(response)
          return response////////////////////
        })
        .catch((err) => console.log(err))
    }

    getGenomeResults($scope.userId)
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.log(err)
      })

  } // END OF CTRL FUNC
})(); // END OF IIFE