var admin = require('firebase-admin');

var serviceAccount = require('../../stemm-lab-678ad-ad232220942d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {
    admin,
    db
}