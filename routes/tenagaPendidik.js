const express = require('express');
const router = express.Router();
const db = require('../firebase'); // Sesuaikan dengan path file firebase.js Anda

// Tambah data tenaga pendidik
router.post('/tenaga-pendidik', async (req, res) => {
  try {
    // Ambil dokumen terakhir untuk mendapatkan nomor urut terakhir
    const snapshot = await db.collection('TenagaPendidik').orderBy('__name__').limitToLast(1).get();
    let lastNumber = 0;

    if (!snapshot.empty) {
      const lastId = snapshot.docs[0].id; // ID dokumen terakhir
      const lastNumberString = lastId.split('-').pop(); // Ambil angka terakhir dari ID
      lastNumber = parseInt(lastNumberString, 10) || 0; // Konversi ke angka
    }

    const currentYear = new Date().getFullYear(); // Tahun saat ini
    const nextNumber = String(lastNumber + 1).padStart(3, '0'); // Nomor berikutnya dengan padding 3 digit
    const customId = `TND-${currentYear}-${nextNumber}`; // Format ID, misalnya: TND-2024-001

    // Data tenaga pendidik dari request body
    const data = {
      id_role: req.body.id_role,
      nama: req.body.nama,
      password: req.body.password,
      verifikator: req.body.verifikator || false,
    };

    // Simpan data dengan ID khusus
    const docRef = db.collection('TenagaPendidik').doc(customId);
    await docRef.set(data);

    res.status(201).send({ message: 'Data berhasil ditambahkan', id: customId });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});


// GET: Tampilkan semua data tenaga pendidik
router.get('/tenaga-pendidik', async (req, res) => {
  try {
    const snapshot = await db.collection('TenagaPendidik').get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send({ message: 'Data berhasil diambil', jumlahDokumen: data.length, data });
  } catch (error) {
    console.error('Firestore Error:', error);
    res.status(500).send({ error: error.message });
  }
});

// GET: Tampilkan data tenaga pendidik berdasarkan ID
router.get('/tenaga-pendidik/:id', async (req, res) => {
  try {
    const docId = req.params.id; // Ambil ID dari parameter URL
    const docRef = db.collection('TenagaPendidik').doc(docId);

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

// DELETE: Hapus tenaga pendidik berdasarkan ID dokumen
router.delete('/tenaga-pendidik/:id', async (req, res) => {
    try {
      const docId = req.params.id; // Ambil ID dari parameter URL
      const docRef = db.collection('TenagaPendidik').doc(docId);
  
      // Periksa apakah dokumen ada
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).send({ message: 'Dokumen tidak ditemukan' });
      }
  
      await docRef.delete(); // Hapus dokumen
      res.status(200).send({ message: 'Dokumen berhasil dihapus', id: docId });
    } catch (error) {
      console.error('Firestore Error:', error);
      res.status(500).send({ error: error.message });
    }
  });
  
  // PUT: Update data tenaga pendidik berdasarkan ID dokumen
  router.put('/tenaga-pendidik/:id', async (req, res) => {
    try {
      const docId = req.params.id; // Ambil ID dari parameter URL
      const data = req.body; // Ambil data dari body request
      const docRef = db.collection('TenagaPendidik').doc(docId);
  
      // Periksa apakah dokumen ada
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).send({ message: 'Dokumen tidak ditemukan' });
      }
  
      await docRef.update(data); // Update dokumen
      res.status(200).send({ message: 'Dokumen berhasil diperbarui', id: docId });
    } catch (error) {
      console.error('Firestore Error:', error);
      res.status(500).send({ error: error.message });
    }
  });

module.exports = router;
