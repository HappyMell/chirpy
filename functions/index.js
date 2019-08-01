const functions = require('firebase-functions');
const app = require('express')()
const {getAllChirps, postOneChirp} = require('./handlers/chirps');
const {signUp} = require('./handlers/users');

const firebaseConfig = {
    apiKey: "AIzaSyAPm0Tg2CvSqvNzOK30mKss7EoiZSpwjn8",
    authDomain: "chirpy-1dcff.firebaseapp.com",
    databaseURL: "https://chirpy-1dcff.firebaseio.com",
    projectId: "chirpy-1dcff",
    storageBucket: "chirpy-1dcff.appspot.com",
    messagingSenderId: "619481866839",
    appId: "1:619481866839:web:4d05d964b2981aca"
  };

  const firebase = require('firebase')
  firebase.initializeApp(firebaseConfig);


//Chirp Routes
app.get('/chirps', getAllChirps);
app.post('/chirp', FBAuth, postOneChirp);


const FBAuth = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'});
    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
        req.user = decodedToken;
        console.log(decodedToken)
        return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
        req.user.handle = data.docs[0].data().handle;
        return next();
    })
    .catch(err => {
        console.error('Error while verifying token ', err)
        return res.status(403).json(err);
    })
}



const isEmpty = (string) => {
    if(string.trim() === '') {
        return true
    } else {
        return false
    }
}

const isEmail = (email) => {
   const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
if(email.match(regEx)) {
    return true
} else {
    return false
   }

}

//Sign up route
app.post('/signup', signUp)

//Login
app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    let errors = {}

    if(isEmpty(user.email)) {
        errors.email = 'Must not be empty'
    }
    if(isEmpty(user.password)) {
        errors.password = 'Must not be empty'
    }

    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({token})
    })
    .catch(err => {
        console.error(err)
        if(err.code === 'auth/wrong-password') {
            return res.status(403).json({general: 'Wrong credentials, please try again'})
        } else {
            return res.status(500).json({error: err.code})
        }
        
    })
})

exports.api = functions.region('europe-west1').https.onRequest(app);