const gql = require('gql');

module.exports = gql.and([
  gql.exact('rs10260404', 'CC'),
  gql.exact('rs10239794', 'CC')
])