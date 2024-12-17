const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah perizinan
router.post('/add-perizinan', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('Perizinan').add(data);
    res.status(201).send({ message: 'Perizinan berhasil ditambahkan', id: docRef.id });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua perizinan
router.get('/get-perizinan', async (req, res) => {
  try {
    const snapshot = await db.collection('Perizinan').get();
    const izinList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(izinList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Tampilkan data tenaga pendidik berdasarkan ID
router.get('/perizinan/:id', async (req, res) => {
  try {
    const docId = req.params.id; // Ambil ID dari parameter URL
    const docRef = db.collection('Perizinan').doc(docId);

    // Ambil data dokumen
    const doc = await docRef.get();

    // Periksa apakah dokumen ada
    if (!doc.exists) {
      return res.status(404).send({ message: 'Dokumen tidak ditemukan', id: docId });
    }

    // Kirim data dokumen jika ditemukan
    res.status(200).send({ message: 'Data berhasil diambil', id: docId, data: doc.data() });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Hapus perizinan berdasarkan ID
router.delete('/perizinan/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('Perizinan').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Perizinan tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Perizinan berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update perizinan berdasarkan ID
router.put('/perizinan/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('Perizinan').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Perizinan tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Perizinan berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
