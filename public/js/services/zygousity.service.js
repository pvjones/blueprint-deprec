(function() {

  angular
    .module('app')
    .service('ZygousityService', ZygousityService);

  function ZygousityService() {

    this.handleZygousity = (categoryArray) => {
      let cleansedArray = categoryArray;

      for (let i = cleansedArray.length - 1; i >= 0; i--) {

        if (cleansedArray[i]) {

          for (let j = i - 1; j >= 0; j--) {

            if (cleansedArray[j].resultname == cleansedArray[i].resultname 
              && cleansedArray[j].resultbool === true) {
              cleansedArray.splice(i, 1);
              break;
            } else if (cleansedArray[j].resultname == cleansedArray[i].resultname && cleansedArray[i].resultbool === true) {
              cleansedArray.splice(j, 1);
              break;
            } else if (cleansedArray[j].resultname == cleansedArray[i].resultname && cleansedArray[i].resultbool === false && cleansedArray[j].resultbool === false) {
              cleansedArray.splice(j, 1);
              break;
            }
          }
        }
      }
      return cleansedArray;
    }

  };
})();

