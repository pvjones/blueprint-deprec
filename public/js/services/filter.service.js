(function() {

  angular
    .module('app')
    .service('FilterService', FilterService)

  function FilterService() {
    this.filter = '';
    this.searchTerm = '';

    this.setFilter = function(filterName) {
      switch(filterName) {
        case 'search':
          if (this.searchTerm && this.searchTerm.length > 0) {
            this.filter = { resultname: this.searchTerm };
          }
          break;
        case 'healthAlert':
          this.filter = { resultbool: true, resultqual : 'negative' }
          break;
        default:
          this.filter = ''
      };
    };

  };
})();