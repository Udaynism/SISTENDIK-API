const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah jadwal mengajar
router.post('/add-jadwal', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('JadwalMengajar').add(data);
    res.status(201).send({ message: 'Jadwal mengajar berhasil ditambahkan', id: docRef.id });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua jadwal mengajar
router.get('/get-jadwal', async (req, res) => {
  try {
    const snapshot = await db.collection('JadwalMengajar').get();
    const jadwalList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(jadwalList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Hapus jadwal mengajar berdasarkan ID
router.delete('/jadwal/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('JadwalMengajar').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Jadwal tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Jadwal berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update jadwal mengajar berdasarkan ID
router.put('/jadwal/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('JadwalMengajar').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Jadwal tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Jadwal berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
