const dna = require('dna2json');
const fs = require('fs');
const path = require('path');

const testBattery = require('./testBattery');

// DEFINITIONS USED BY METHODS

let gqlQuery = (genoset, userJSON) => {
  const query = require(`./queries/${genoset}`)
  const dna = require(userJSON);
  return matches = query(dna);
};

let userJSON = path.join(__dirname, './../../userTMP/userJSON.json');

// EXPORT METHODS

module.exports = {

  translateToJSON: (req, res, next) => {

    let userTXT = req.body.file;

    if (userTXT) {
      //let txt = fs.readFileSync(readPath, "utf-8");
      dna.parse(userTXT, function(err, snps) {
        fs.writeFileSync(userJSON, JSON.stringify(snps));
        console.log('DNA Successfully Parsed')
      });
    };
    next();
  },

  runBattery: function(req, res, next) {

    let resultsArray = [];
    let battery = testBattery.tests

    for (let i = 0; i < battery.length; i++) {

      let genoset = battery[i].genosetName;

      let testResult = {
        genosetName: genoset,
        genosetDesc: battery[i].genosetDesc,
        genosetLongDesc: battery[i].genosetLongDesc,
        resultType: battery[i].resultType,
        resultName: battery[i].resultName,
        resultDescTrue: battery[i].resultDescTrue,
        resultDescFalse: battery[i].resultDescFalse,
        resultBool: gqlQuery(genoset, userJSON)
      };

      resultsArray.push(testResult);
    }
    req.body.genomeResults = resultsArray;
    console.log('runBattery')
    next();
  },

  clearUserJSON: (req, res, next) => {
    fs.unlink(userJSON, (err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log('user DNA cleared');
        next();
      }

    })

  }
}