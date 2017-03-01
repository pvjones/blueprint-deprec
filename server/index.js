const express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  massive = require('massive'),
  passport = require('passport'),
  Auth0Strategy = require('passport-auth0'),
  cors = require('cors'),
  path = require('path');

const config = require('./config');

const app = module.exports = express();

// bodyParser setup
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

// session setup
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + './../public'));

/* DATABASE SETUP */
////////////////////

const connectionString = 'postgres://postgres:postgres@localhost/blueprint'
const massiveInstance = massive.connectSync({
  connectionString: connectionString
});

app.set('db', massiveInstance);
const db = app.get('db');

// CONTROLLERS MUST BE SET AFTER APP.SET('DB')
const genomeService = require('./genomeJS/genomeService');
const genomeController = require('./controllers/genomeController');
const userController = require('./controllers/userController');

/* TABLE INIT */
////////////////

db.init.createUserTable([], (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('userTable initialized');
  }
});

db.init.createGenotypeResultsTable([], (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('genotypeResultsTable initialized');
  }
});

db.init.createUserGenomesTable([], (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('userGenomeTable initialized');
  }
});

db.init.createDetailsTable([], (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('detailsTable initialized');
  }
})

/* AUTH0 SETUP */
/////////////////

passport.use(new Auth0Strategy(config.authConfig, (accessToken, refreshToken, extraParams, profile, done) => {

  db.user.getUserByAuthId([profile.id], function(err, result) { //cb to execute after return from Auth0 (i.e. find user in DB)
    if (err) {
      console.error(err)
    };
    let user = result[0];
    if (!user) { //if there isn't one, will create
      console.log('CREATING USER');
      db.user.createUserByAuth([
        profile.displayName,
        profile.id
      ], (err, result) => {
        if (err) {
          console.error(err)
        };
        return done(err, result[0]); // GOES TO SERIALIZE USER **done function  is the same thing as 'next' function
      })
    } else { //once user is found, return
      return done(err, result);
    }
  })
}));

//Create the deserialize/serializer methods on passport. Since we won't be doing anything further than just passing objects to/from passport and the session, we just need bare bones methods here:
passport.serializeUser((userA, done) => {
  done(null, userA); //PUTS 'USER' ON THE SESSION
});

passport.deserializeUser((userB, done) => {
  done(null, userB); //PUTS 'USER' ON REQ.USER
});

//PASSPORT AND AUTH0 ENDPOINTS
app.get('/api/auth', passport.authenticate('auth0')); //initiates auth0 for user
app.get('/api/auth/callback', passport.authenticate('auth0', {
  successRedirect: '/#!/start',
  failureRedirect: '/#!/start' //Behavior for first-time-logins -- **NEEDS TO BE A SEPARATE PAGE, WITH THE WAY MY RESOLVES ARE CURRENTLY SET UP?
})); // defines what happens after authentication
app.get('/api/logout', function(req, res, next) {
  req.logout();
  return res.redirect('/')
});

/* REQ.USER ENDPOINTS */
////////////////////////

app.get('/api/auth/user', userController.currentUser);

/* GENOMEJS ENDPOINTS */
////////////////////////

app.post('/api/upload', genomeService.translateToJSON, genomeService.runBattery, genomeController.getMaxGenomeId, genomeController.storeGenomeResults, genomeController.storeUserGenomeClassifiers, (req, res, next) => {

  genomeService.clearUserJSON()
  console.log('file size *** ' + req.body.file.length)
  
  return res.status(200)
    .json('Results stored in database');

})

app.get('/api/results/:userId', genomeController.getMaxGenomeId, genomeController.getAllGenomeResultsByUserId, (req, res, next) => {
  return res.status(200)
    .send(req.body.allGenomeResults)
});



app.post('/api/insertdetail', genomeController.insertDetail);

app.get('/api/getdetail/:genosetName', genomeController.getDetail);

/* LISTEN */
////////////

app.listen(config.port, function() {
  console.log(`Express is running on ${config.port}`)
});