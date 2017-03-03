(function() {
  angular
    .module('app')
    .service('ChartResizeService', ChartResizeService);

  function ChartResizeService() {

    this.calculateElementWidth = (element) => {
      if (!element.offsetWidth) {
        return 0;
      }
      let style = window.getComputedStyle(element);
      let width = element.offsetWidth;
      return width;

      console.log(style)
    }

  };
})();