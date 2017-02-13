const gql = require('gql');

module.exports = gql.or([
    gql.doesntExist('rs8176719'),
    gql.only('rs8176719', 'D')
  ]);