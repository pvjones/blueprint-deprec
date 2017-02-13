const gql = require('gql');
const isMale = require('./isMale');

module.exports = function(dna) {
  return !isMale(dna);
}