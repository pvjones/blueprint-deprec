const dna = require('dna2json');
const fs = require('fs');
const path = require('path');


exports.toJSON = (readPath, writePath) => {
  if (readPath, writePath) {
    //let txt = fs.readFileSync(readPath, "utf-8");
    let txt = readPath;
    dna.parse(txt, function(err, snps) {
      fs.writeFileSync(writePath, JSON.stringify(snps));
    console.log('DNA Successfully Parsed')
    });
  };
};

exports.clear = (writePath) => {
  fs.unlink(writePath, (err, result) => {
    if (err) console.error(err);
    console.log('user DNA cleared');
  });
};