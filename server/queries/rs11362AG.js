const gql = require('gql');

module.exports = gql.and([
  gql.has('rs11362', 'A'),
  gql.has('rs11362', 'G')
]);