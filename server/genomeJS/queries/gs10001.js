const gql = require('gql');

module.exports = gql.or([
  gql.has('rs1800546', 'C'),
  gql.has('rs78340951', 'G'),
  gql.has('rs76917243', 'T'),
  gql.exact('rs387906225', 'AAAC')
]);