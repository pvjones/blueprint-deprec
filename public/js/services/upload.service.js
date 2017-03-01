(function() {
  angular
    .module('app')
    .service('UploadService', UploadService)

  function UploadService($http, $q) {

    this.sendGenomeTXT = (uploadTXT, genomeName) => {
      var deferred = $q.defer();    
      $http({    
            method: 'POST',
            url: '/api/upload',
            data: {
                    file: uploadTXT,
                    genomeName: genomeName
                  }
      }).then((res) => {      
        deferred.resolve(res.data);    
      }).catch((res) => {      
        deferred.reject(res);    
      });    
      return deferred.promise;
    }

  } //END OF SVC FUNC

})(); //END OF IIFE