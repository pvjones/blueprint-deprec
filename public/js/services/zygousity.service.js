(function() {

  angular
    .module('app')
    .service('ZygousityService', ZygousityService);

  function ZygousityService() {

    this.handleZygousity = (categoryArray) => {
      let cleansedArray = categoryArray;

      for (let i = cleansedArray.length - 1; i >= 0; i--) {
        if (cleansedArray[i].resultbool === false) {
          for (let j = cleansedArray.length - 1; j >= 0; j--) {
            if (cleansedArray[j].resultname == cleansedArray[i].resultname && cleansedArray[j].resultbool === true) {
              cleansedArray.splice(i, 1);
              break;
            } 
          }
        }
      }

      return cleansedArray;
    }

  };
})();

