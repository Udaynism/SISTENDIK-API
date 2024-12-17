const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah presensi siswa
router.post('/add-presensi', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('PresensiSiswa').add(data);
    res.status(201).send({ message: 'Data presensi berhasil ditambahkan', id: docRef.id });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua presensi siswa
router.get('/get-presensi', async (req, res) => {
  try {
    const snapshot = await db.collection('PresensiSiswa').get();
    const presensiList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(presensiList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Hapus presensi berdasarkan ID
router.delete('/presensi/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('PresensiSiswa').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data presensi tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Data presensi berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update presensi siswa berdasarkan ID
router.put('/presensi/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('PresensiSiswa').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data presensi tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Data presensi berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
