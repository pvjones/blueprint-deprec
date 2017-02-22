const express = require('express')
    , session = require('express-session')
    , bodyParser = require('body-parser')
    , massive = require('massive')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , cors = require('cors')
    , path = require('path');

const config = require('./config');

const genotests = require('./genotests');
const userController = require('./controllers/userController')

const app = express();

app.use(bodyParser.json());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + './../public'));

////////////////////
// DATABASE SETUP //
////////////////////

const connectionString = 'postgres://postgres:postgres@localhost/blueprint'
const massiveInstance = massive.connectSync({connectionString: connectionString});

app.set('db', massiveInstance);
const db = app.get('db');

/////////////////////////
// DATABASE TABLE INIT //
/////////////////////////

db.init.createUserTable([], (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('User table initialized')
  }
});

db.init.createResultsTable([], (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Results table initialized')
  }
});

/////////////////
// AUTH0 SETUP //
/////////////////

passport.use(new Auth0Strategy(config.authConfig, (accessToken, refreshToken, extraParams, profile, done) => {

    db.user.getUserByAuthId([profile.id], function(err, result) { //cb to execute after return from Auth0 (find user in DB)
      if (err) {console.error(err)};
      let user = result[0];
      if (!user) { //if there isn't one, will create
        console.log('CREATING USER');
        db.user.createUserByAuth([
          profile.displayName, 
          profile.id
          ], (err, result) => {
            if (err) {console.error(err)};
            return done(err, result[0]); // GOES TO SERIALIZE USER **done function  is the same thing as 'next' function
        })
      } else { //when we find the user, return it
        return done(err, result);
      }
    })
  }
));

//Create the deserialize/serializer methods on passport. Since we won't be doing anything further than just passing objects to/from passport and the session, we just need bare bones methods here:
passport.serializeUser((userA, done) => {
    done(null, userA); //PUTS 'USER' ON THE SESSION
});

passport.deserializeUser((userB, done) => {
    done(null, userB); //PUTS 'USER' ON REQ.USER
});

//AUTH0 ENDPOINTS
app.get('/auth', passport.authenticate('auth0')); //initiate auth0 for user
app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: '/#!/start',
  failureRedirect: '/#!/start-error'
})); // define what happens after authentication

////////////////////////
// REQ.USER ENDPOINTS //
////////////////////////

app.get('/api/auth/user', userController.currentUser);

////////////////////////
// GENOMEJS ENDPOINTS //
////////////////////////

//FILE UPLOAD
app.post('/api/upload', function(req, res, next) {

  let userJSON = path.join(__dirname, './../userTMP/userJSON.json');
  let userTXT = req.body.file;
  let userId = req.user.id;
  let testResults = genotests.runBattery(userTXT, userJSON);
  console.log(testResults);

});



///////////////
// LISTEN UP //
///////////////

app.listen(config.port, function() {
  console.log(`Express is running on ${config.port}`)
});