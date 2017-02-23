const port = 3000;

module.exports = {
  port: port,
  secret: 'rubberhorsestoastedonahoodstoolbun',
  authConfig: {
    domain: 'pvjones.auth0.com',
    clientID: 'skFdEC6NDHf0MmvCAUE753ElqgAEwiSc',
    clientSecret: '-iyNCyWijHvkcDzE688rOumdKSHK94MqSrI2_bYkSk3j2OE8DPGHtJfsdB_gaLRT',
    callbackURL: `http://localhost:${port}/api/auth/callback`
  }
};