(function() {
  angular
    .module('app')
    .controller('detailController', detailController);

  function detailController($scope, $stateParams, DetailService) {

    getDetail($stateParams.descriptionId);

    function getDetail(descriptionId) {
      DetailService.getDetail(descriptionId)
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