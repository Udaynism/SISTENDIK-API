const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah role
router.post('/role', async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('Role').add(data);
    res.status(201).send({ message: 'Role berhasil ditambahkan', id: docRef.id });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua role
router.get('/role', async (req, res) => {
  try {
    const snapshot = await db.collection('Role').get();
    const roleList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(roleList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Hapus role berdasarkan ID
router.delete('/role/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('Role').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Role tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Role berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update role berdasarkan ID
router.put('/role/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('Role').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Role tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Role berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
