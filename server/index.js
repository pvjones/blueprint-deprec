const express = require('express');
const bodyParser = require('body-parser');
const genotests = require('./genotests');
const path = require('path');

const config = require('./config')

const app = express();





app.use(express.static(__dirname + './../public'));

let userPath = path.join(__dirname, './../data/raw/user3/genome_Greg_Mendel_Dad__v4_Full_20170201075106');
let userTXT = userPath + '.txt';
let userJSON = path.join(__dirname, './../userTMP/userJSON.json');

//genotests.runBattery(userTXT, userJSON)

app.listen(config.port, function() {
  console.log(`Express is running on ${config.port}`)
});