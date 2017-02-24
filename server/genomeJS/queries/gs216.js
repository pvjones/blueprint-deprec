const gql = require('gql')

module.exports = gql.and([
  gql.exact('rs429358', 'CC'),
  gql.exact('rs7412', 'CC')
])