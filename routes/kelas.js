const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah kelas
router.post('/add-kelas', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('Kelas').add(data);
    res.status(201).send({ message: 'Kelas berhasil ditambahkan', id: docRef.id });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua kelas
router.get('/get-kelas', async (req, res) => {
  try {
    const snapshot = await db.collection('Kelas').get();
    const kelasList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(kelasList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Hapus kelas berdasarkan ID
router.delete('/kelas/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('Kelas').doc(docId);
    const doc = await
    docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Kelas tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Kelas berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update kelas berdasarkan ID
router.put('/kelas/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('Kelas').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Kelas tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Kelas berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
