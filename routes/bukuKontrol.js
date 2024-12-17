const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah buku kontrol
router.post('/add-buku', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('BukuKontrol').add(data);
    res.status(201).send({ message: 'Buku kontrol berhasil ditambahkan', id: docRef.id });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua buku kontrol
router.get('/get-buku', async (req, res) => {
  try {
    const snapshot = await db.collection('BukuKontrol').get();
    const bukuList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(bukuList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Hapus buku kontrol berdasarkan ID
router.delete('/buku/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('BukuKontrol').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data buku kontrol tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Data buku kontrol berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update buku kontrol berdasarkan ID
router.put('/buku/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('BukuKontrol').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data buku kontrol tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Data buku kontrol berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
