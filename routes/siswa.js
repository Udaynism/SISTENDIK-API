const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Tambah data siswa
router.post('/add-siswa', async (req, res) => {
  try {
    const { nisn, namaSiswa, id_kelas, jenisKelamin } = req.body;

    // Validasi input
    if (!nisn || !namaSiswa || !id_kelas || !jenisKelamin) {
      return res.status(400).send({
        error: 'Semua atribut (nisn, namaSiswa, id_kelas, jenisKelamin) harus diisi',
      });
    }

    // Periksa apakah nisn sudah ada
    const existingDoc = await db.collection('Siswa').doc(nisn).get();
    if (existingDoc.exists) {
      return res.status(400).send({
        error: 'NISN sudah terdaftar. Gunakan NISN lain.',
      });
    }

    // Menambahkan data siswa dengan nisn sebagai ID dokumen
    await db.collection('Siswa').doc(nisn).set({ namaSiswa, id_kelas, jenisKelamin });
    res.status(201).send({ message: 'Data siswa berhasil ditambahkan', id: nisn });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil semua data siswa
router.get('/get-siswa', async (req, res) => {
  try {
    const snapshot = await db.collection('Siswa').get();
    const siswaList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(siswaList);
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Ambil data siswa berdasarkan ID (nisn)
router.get('/get-siswa/:id', async (req, res) => {
  try {
    const id = req.params.id; // ID sama dengan NISN karena kita gunakan sebagai dokumen ID
    const docRef = db.collection('Siswa').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data siswa tidak ditemukan' });
    }

    res.status(200).send({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});


// DELETE: Hapus siswa berdasarkan ID
router.delete('/siswa/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const docRef = db.collection('Siswa').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data siswa tidak ditemukan' });
    }

    await docRef.delete();
    res.status(200).send({ message: 'Data siswa berhasil dihapus', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// PUT: Update data siswa berdasarkan ID
router.put('/siswa/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    const docRef = db.collection('Siswa').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Data siswa tidak ditemukan' });
    }

    await docRef.update(data);
    res.status(200).send({ message: 'Data siswa berhasil diperbarui', id: docId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
