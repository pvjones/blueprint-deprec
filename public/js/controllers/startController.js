(function() {

  angular
    .module('app')
    .controller('startController', startController)

  function startController($scope, $state, authService, uploadService, user) {

    $scope.username = user.userName;

    $scope.uploadGenomeTXT = function(TXT) {
        $scope.showUpload = true;
        if (TXT) {
          
          uploadService.sendGenomeTXT(TXT).then((response) => {
            console.log(response);
            $state.go('summary');
          }, (err) => console.log(err))
        }
      }
      /******************** submitForm ********************/
    
  } // END OF CONTROLLER FUNCTION

})(); // END OF IIFE