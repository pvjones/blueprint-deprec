(function() {

  angular
    .module('app')
    .controller('startController', startController)

  function startController($scope, authService, uploadService) {

    function getUser() {
      authService.getUser()
        .then(function(res) {
          $scope.username = res.username;
        });
    }

    getUser();

    $scope.uploadGenomeTXT = function(TXT) {
      console.log("uploadGenomeTXT fired");
      if (TXT) {
        console.log("TXT is truthy")
        $scope.loadingMessage = "Uploading and converting your genotyping results";
        uploadService.sendGenomeTXT(TXT)
      }
    }
  }

})();