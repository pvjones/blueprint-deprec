const gql = require('gql');
const isMale = require('./isMale');

module.exports = function(dna) {
  if (!isMale(dna)) { // gs145.
    return true;
  } else {
    return false;
  }
}