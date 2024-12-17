const admin = require('firebase-admin');
const serviceAccount = require('./sistem-tenaga-kependidikan-firebase-adminsdk-voxsp-55690c4dab.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sistem-tenaga-kependidikan-default-rtdb.asia-southeast1.firebasedatabase.app', // Ganti dengan URL proyek Anda.
});

const db = admin.firestore();
module.exports = db;
