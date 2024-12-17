const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah jurusan
router.post('/add-jurusan', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('Jurusan').add(data);
    res.status(201).send({ message: 'Jurusan berhasil ditambahkan', id: docRef.id });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua jurusan
router.get('/get-jurusan', async (req, res) => {
  try {
    const snapshot = await db.collection('Jurusan').get();
    const jurusanList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(jurusanList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Hapus jurusan berdasarkan ID
router.delete('/jurusan/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('Jurusan').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data jurusan tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Jurusan berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update jurusan berdasarkan ID
router.put('/jurusan/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('Jurusan').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data jurusan tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Data jurusan berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
