module.exports = {

  // RETURN CURRENT USER //
  currentUser: function(req, res, next) {
    // If user isnt on the session, then return error status
    if (!req.user) {
      console.log('Current user not found');
      return res.status(401)
        .send('current user not defined');
    }

    let user = req.user;

    // Return user
    console.log(user);
    return res.status(200)
      .json(user);
  }

};