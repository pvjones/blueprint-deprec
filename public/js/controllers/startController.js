(function() {

  angular
    .module('app')
    .controller('startController', startController)

  function startController($scope, $state, authService, uploadService, user) {

    $scope.username = user.userName;

    $scope.uploadGenomeTXT = function(TXT) {
      console.log("uploadGenomeTXT fired");
      if (TXT) {
        $scope.loadingMessage = "Uploading and converting your genotyping results";
        uploadService.sendGenomeTXT(TXT).then((response) => {
          console.log(response);
          $state.go('summary');
        }, (err) => console.log(err))
      }
    }
  
  } // END OF CONTROLLER FUNCTION

})(); // END OF IIFE

