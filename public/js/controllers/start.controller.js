(function() {

  angular
    .module('app')
    .controller('StartController', StartController)

  function StartController($scope, $state, UploadService, user) {

    $scope.username = user.userName;

    $scope.uploadGenomeTXT = function(TXT) {
        $scope.showUpload = true;
        if (TXT) {
          
          UploadService.sendGenomeTXT(TXT).then((response) => {
            console.log(response);
            $state.go('summary');
          }, (err) => console.log(err))
        }
      }
    
  } // END OF CONTROLLER FUNCTION

})(); // END OF IIFE