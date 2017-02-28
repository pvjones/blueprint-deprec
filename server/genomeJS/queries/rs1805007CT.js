const gql = require('gql');

module.exports = gql.and([
  gql.has('rs1805007', 'C'),
  gql.has('rs1805007', 'T')
  ]);


