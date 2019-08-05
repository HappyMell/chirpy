const functions = require('firebase-functions');
const app = require('express')()
const FBAuth = require('./util/fbAuth');
const { db } = require('./util/admin');
const cors = require('cors');
app.use(cors());
const {
    getAllChirps,
    postOneChirp,
    getChirp,
    commentOnChirp,
    likeChirp,
    unlikeChirp,
    deleteChirp
} = require('./handlers/chirps');
const {
    signUp,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users');

//Chirp Routes
app.get('/chirps', getAllChirps);
app.post('/chirp', FBAuth, postOneChirp);
app.get('/chirp/:chirpId', getChirp);
app.post('/chirp/:chirpId/comment', FBAuth, commentOnChirp)
app.get('/chirp/:chirpId/like', FBAuth, likeChirp);
app.get('/chirp/:chirpId/unlike', FBAuth, unlikeChirp)
app.delete('/chirp/:chirpId', FBAuth, deleteChirp);



//Login and Signup route and Users
app.post('/signup', signUp)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);


exports.api = functions.region('europe-west2').https.onRequest(app);

exports.createNotificationOnLike = functions
    .region('europe-west2')
    .firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db
            .doc(`/chirps/${snapshot.data().chirpId}`)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        chirpId: doc.id
                    });
                }
            })
            .catch((err) => console.error(err));
    });

exports.deleteNotificationOnUnLike = functions
    .region('europe-west2')
    .firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err) => {
                console.error(err);
                return;
            });
    });

exports.createNotificationOnComment = functions
    .region('europe-west2')
    .firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db
            .doc(`/chirps/${snapshot.data().chirpId}`)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        chirpId: doc.id
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                return;
            });
    });

exports.onUserImageChange = functions.region('europe-west2').firestore.document('/users/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            console.log('Image has changed');
            const batch = db.batch();
            return db.collection('chirps')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then((data) => {
                    data.forEach(doc => {
                        const chirp = db.doc(`/chirps/${doc.id}`);
                        batch.update(chirp, { userImage: change.after.data().imageUrl });
                    })
                    return batch.commit();
                })
        } else {
            return true;
        }

    });


exports.onChirpDelete = functions.region('europe-west2').firestore.document('/chirps/{chirpId}')
    .onDelete((snapshot, context) => {
        const chirpId = context.params.chirpId;
        const batch = db.batch();
        return db.collection('comments')
            .where('chripId', '==', chirpId)
            .get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes')
                    .where('chirpId', '==', chirpId)
                    .get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications')
                    .where('chirpId', '==', chirpId)
                    .get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err => {
                console.error(err);
            })
    })    