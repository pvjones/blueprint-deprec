const gql = require('gql');

module.exports = gql.or([
  gql.has('i3002808', 'C'),
  gql.has('rs79761867', 'C'),
  gql.has('rs28934895', 'C')
]);