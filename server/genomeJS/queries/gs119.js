const gql = require('gql');
const isMale = require('./isMale');

module.exports = (dna) => {
  if (isMale(dna)) {
    return null;
  } else {
    let query = gql.or([
      gql.and([
        gql.exact('rs1501299', 'GG'),
        gql.exact('rs2241766', 'TT')
      ]),
      gql.and([
        gql.exact('rs1501299', 'GT'),
        gql.exact('rs2241766', 'TT')
      ]),
      gql.and([
        gql.exact('rs1501299', 'GG'),
        gql.exact('rs2241766', 'GT')
      ])
    ]);
    return query(dna);
  }
};