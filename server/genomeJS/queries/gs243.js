const gql = require('gql');
const isMale = require('./isMale');

module.exports = (dna) => {
  if (!isMale(dna)) {
    return null;
  } else {
    let query = gql.atLeast(4, [
      gql.has('rs1137100', 'A'),
      gql.has('rs627839', 'T'),
      gql.has('rs2070874', 'T'),
      gql.has('rs10778534', 'C'),
      gql.has('rs5993891', 'T')
    ]);
    return query(dna);
  };
};