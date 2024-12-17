const express = require('express');
const bodyParser = require('body-parser');
const tenagaPendidikRoutes = require('./routes/tenagaPendidik');
const siswaRoutes = require('./routes/siswa');
const presensiRoutes = require('./routes/presensiSiswa');
const jadwalRoutes = require('./routes/jadwalMengajar');
const bukuRoutes = require('./routes/bukuKontrol');
const jurusanRoutes = require('./routes/jurusan');
const roleRoutes = require('./routes/role');
const perizinanRoutes = require('./routes/perizinan');
const mataPelajaranRoutes = require('./routes/mataPelajaran');
const kelasRoutes = require('./routes/kelas');

const app = express();
app.use(bodyParser.json());

// Daftarkan routes
app.use(tenagaPendidikRoutes);
app.use(siswaRoutes);
app.use(presensiRoutes);
app.use(jadwalRoutes);
app.use(bukuRoutes);
app.use(jurusanRoutes);
app.use(roleRoutes);
app.use(perizinanRoutes);
app.use(mataPelajaranRoutes);
app.use(kelasRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
