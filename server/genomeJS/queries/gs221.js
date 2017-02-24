const gql = require('gql')

module.exports = gql.and([
  gql.has('rs2395182', 'T'),
  gql.has('rs7775228', 'C'),
  gql.not(gql.has('rs4713586', 'C'))
]);