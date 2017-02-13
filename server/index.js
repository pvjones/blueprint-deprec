const express = require('express');
const bodyParser = require('body-parser');
const genotests = require('./genotests');

const port = 4000;

const app = express();
app.use(express.static(__dirname + './../public'));

let userPath = './../data/raw/user3/genome_Greg_Mendel_Dad__v4_Full_20170201075106';
let userTXT = userPath + '.txt';

let userJSON = './../userTMP/userJSON.json';

genotests.runBattery(userTXT, userJSON)

app.listen(port, function() {
  console.log(`Express is running on ${port}`)
});