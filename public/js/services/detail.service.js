(function() {

  angular
    .module('app')
    .service('DetailService', DetailService)

  function DetailService($http) {

    this.getDetail = (descriptionId) => {
      return $http({
        method: 'GET',
        url: `/api/getdetail/${descriptionId}`
      })
      .then((response) => {
        return(response.data[0].detailobject)
      })
      .catch((error) => {
        console.log(error)
        throw new Error(error)
      });
    };
  };
})();