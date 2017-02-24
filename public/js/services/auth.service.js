(function() {
  angular
    .module('app')
    .service('AuthService', AuthService)

  function AuthService($http) {

  this.getUser = () => {
      return $http({
          method: 'GET',
          url: '/api/auth/user'
        })
        .then((response) => {
          return response.data[0];
        })
        .catch((err) => {
          throw new Error(err);
        })
    };

  }

})();