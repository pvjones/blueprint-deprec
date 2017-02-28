(function() {

  angular
    .module('app')
    .controller('categoryTableController', categoryTableController)

  function categoryTableController() {

    this.colorResult = (resultObj) => {
      let color = "";

      if (resultObj.resulttype == "Inherited Conditions"
        && resultObj.resultbool == false) {
        color= "green";
      } else if (resultObj.resultqual == "positive" 
        && resultObj.resultbool == true) {
        color = "green";
      } else if (resultObj.resultqual == "positive" 
        && resultObj.resultbool == false) {
        color = "yellow";
      } else if (resultObj.resultqual == "negative" 
        && resultObj.resultbool == false) {
        color = "yellow";
      } else if (resultObj.resultqual == "negative" 
        && resultObj.resultbool == true) {
        color = "red";
      } else {
        color = "black"
      }
    
      
    return color;
    }

  };
})();