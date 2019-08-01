const functions = require('firebase-functions');
const app = require('express')()
const FBAuth = require('./util/fbAuth');
const {getAllChirps, postOneChirp} = require('./handlers/chirps');
const {signUp, login} = require('./handlers/users');




//Chirp Routes
app.get('/chirps', getAllChirps);
app.post('/chirp', FBAuth, postOneChirp);

//Login and Signup route
app.post('/signup', signUp)
app.post('/login', login)



exports.api = functions.region('europe-west1').https.onRequest(app);