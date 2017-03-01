(function() {
  angular
    .module('app')
    .controller('detailController', detailController);

  function detailController($scope, $stateParams, DetailService) {

    getDetail($stateParams.genosetName);

    function getDetail(genosetName) {
      DetailService.getDetail(genosetName)
        .then((response) => {
          $scope.detail = response
          console.log('detailController', $scope.detail);
        })
        .catch((error) => {
          console.log(error);
        })
    };

  };
})();