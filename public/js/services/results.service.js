(function() {
  angular
    .module('app')
    .service('ResultsService', ResultsService)

  function ResultsService($http) {

    this.getResultsByUserId = (userId) => {
      console.log("service userId", userId)
      return $http({
        method: 'GET',
        url: `/api/results/${userId}`,
      })
      .then((response) => {
        console.log(response)
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      })
    }

    this.cleanseGenotypeResults = (genotypeResultsObject) => {
      return genotypeResultsObject ////////////////
    }

  }; // END OF SVC FUNC
})(); // END OF IIFE