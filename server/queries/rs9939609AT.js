const gql = require('gql');

module.exports = gql.and([
  gql.has('rs9939609', 'A'),
  gql.has('rs9939609', 'T')
  ]);