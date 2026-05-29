var admin = require('firebase-admin');

var serviceAccount = require('../../stemm-lab-678ad-firebase-adminsdk-fbsvc-4f6094b85c.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {
    admin,
    db
}