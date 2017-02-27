(function() {

  angular
    .module('app')
    .controller('StartController', StartController)

  function StartController($scope, $state, UploadService, user) {

    $scope.username = user.userName;

    $scope.uploadGenomeTXT = function(TXT, genomeName) {
        if (TXT && $scope.genomeName) {
          $scope.showUpload = true;
          UploadService.sendGenomeTXT(TXT, genomeName)
            .then((response) => {
              console.log(response);
              $state.go('summary');
            }, (err) => console.log(err))
        }
      }
    
  } // END OF CONTROLLER FUNCTION
})(); // END OF IIFE