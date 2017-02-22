(function() {
  angular
    .module('app')
    .service('authService', authService)

  function authService($http) {

  this.getUser = function() {
      return $http({
          method: 'GET',
          url: '/api/auth/user'
        })
        .then(function(res) {
          console.log(res.data[0])
          return res.data[0];
        });
    };

  }

})();