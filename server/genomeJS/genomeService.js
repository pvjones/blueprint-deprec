const dna = require('dna2json');
const fs = require('fs');
const path = require('path');

const testBattery = require('./testBattery');
const userJSON = path.join(__dirname, './../../userTMP/userJSON.json');

// DEFINITIONS USED BY EXPORTS

let gqlQuery = (genoset, userDNA) => {
  const query = require(`./queries/${genoset}`)
  return matches = query(userDNA);
};

module.exports = {

  translateToJSON: (req, res, next) => {
    let userTXT = req.body.file;
    if (userTXT) {
      //let txt = fs.readFileSync(readPath, "utf-8");
      dna.parse(userTXT, function(err, snps) {
        fs.writeFileSync(userJSON, JSON.stringify(snps));
        console.log('DNA successfully Parsed')
      });
    };
    next();
  },

  runBattery: function(req, res, next) {
    let resultsArray = [];
    const battery = testBattery.tests
    let userDNA = require(userJSON);
    for (let i = 0; i < battery.length; i++) {

      let genoset = battery[i].genosetName;
      let testResult = {
        genosetName: genoset,
        genosetDesc: battery[i].genosetDesc,
        descriptionId: battery[i].descriptionId,
        resultType: battery[i].resultType,
        resultName: battery[i].resultName,
        resultDescTrue: battery[i].resultDescTrue,
        resultDescFalse: battery[i].resultDescFalse,
        resultBool: gqlQuery(genoset, userDNA),
        resultQual: battery[i].resultQual
      };
      resultsArray.push(testResult);
    }

    req.body.genomeResults = resultsArray;
    console.log('Battery successfully run');

    next();
  },

  clearUserJSON: () => {
    fs.unlinkSync(userJSON);
    delete require.cache[require.resolve(userJSON)]
    console.log('user DNA cleared');
  },
};