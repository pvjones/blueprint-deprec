const gql = require('gql')

module.exports = gql.atLeast(2, [
  gql.has('rs6413413', 'T'),
  gql.has('rs283413', 'T'),
  gql.has('rs1693482', 'A'),
  gql.has('rs698', 'G')
]);