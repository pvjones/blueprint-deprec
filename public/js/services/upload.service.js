(function() {
  angular
    .module('app')
    .service('uploadService', uploadService)

  function uploadService($http, $q) {

    this.sendGenomeTXT = (uploadTXT) => {
      var deferred = $q.defer();    
      $http({    
            method: 'POST',
            url: '/api/upload',
            data: {file: uploadTXT}
      }).then(function(res) {      
        deferred.resolve(res.data);    
      }).catch(function(res) {      
        deferred.reject(res);    
      });    
      return deferred.promise;
    }

  } //END OF SVC FUNC

})(); //END OF IIFE