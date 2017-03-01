(function() {

  angular
    .module('app')
    .service('DetailService', DetailService)

  function DetailService($http) {

    this.getDetail = (genosetName) => {
      return $http({
        method: 'GET',
        url: `/api/getdetail/${genosetName}`
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