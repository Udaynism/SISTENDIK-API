const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah mata pelajaran
router.post('/add-matapelajaran', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('MataPelajaran').add(data);
    res.status(201).send({ message: 'Mata pelajaran berhasil ditambahkan', id: docRef.id });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua mata pelajaran
router.get('/get-matapelajaran', async (req, res) => {
  try {
    const snapshot = await db.collection('MataPelajaran').get();
    const mapelList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(mapelList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Hapus mata pelajaran berdasarkan ID
router.delete('/matapelajaran/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('MataPelajaran').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Mata pelajaran tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Mata pelajaran berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update mata pelajaran berdasarkan ID
router.put('/matapelajaran/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('MataPelajaran').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Mata pelajaran tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Mata pelajaran berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
