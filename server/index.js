const express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  massive = require('massive'),
  passport = require('passport'),
  Auth0Strategy = require('passport-auth0'),
  cors = require('cors'),
  path = require('path');

const config = require('./config');

const genotests = require('./genotests');
const userController = require('./controllers/userController')

const app = express();

// bodyParser setup
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

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
const massiveInstance = massive.connectSync({
  connectionString: connectionString
});

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

db.init.createGenotypeResultsTable([], (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Genotype Results table initialized')
  }
});

/////////////////
// AUTH0 SETUP //
/////////////////

passport.use(new Auth0Strategy(config.authConfig, (accessToken, refreshToken, extraParams, profile, done) => {

  db.user.getUserByAuthId([profile.id], function(err, result) { //cb to execute after return from Auth0 (find user in DB)
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
    } else { //when we find the user, return it
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
  failureRedirect: '/#!/start-error'
})); // defines what happens after authentication
app.get('/api/logout', function(req, res, next) {
  req.logout();
  return res.redirect('/')
});

////////////////////////
// REQ.USER ENDPOINTS //
////////////////////////

app.get('/api/auth/user', userController.currentUser);

////////////////////////
// GENOMEJS ENDPOINTS //
////////////////////////

//FILE UPLOAD
app.post('/api/upload', function(req, res, next) {

  let userId = req.user[0].userid;
  let genomeId = 1;

  let userJSON = path.join(__dirname, './../userTMP/userJSON.json');
  let userTXT = req.body.file;

  // Check for previously uploaded genome results
  db.genotypes.checkGenomeId([userId], (err, result) => {
    if (err) {
      console.error('User genome not found', err);
    } else {
      let tempId = result[0].max;
      genomeId = ++tempId;
    }

    // Then get gql results
    let testResultsArray = genotests.runBattery(userTXT, userJSON);

    // Then store gql results in genotypeResultsTable
    testResultsArray.forEach((elem, index, array) => {
      db.genotypes.insertGenotype([
        userId,
        genomeId,
        elem.genosetName,
        elem.genosetDesc,
        elem.genosetLongDesc,
        elem.resultType,
        elem.resultName,
        elem.resultDescTrue,
        elem.resultDescFalse,
        elem.resultBool
      ], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(404)
            .json(err);
        }
      })
    })

    return res.status(200)
      .json('Results stored in database');
  })



});



///////////////
// LISTEN UP //
///////////////

app.listen(config.port, function() {
  console.log(`Express is running on ${config.port}`)
});