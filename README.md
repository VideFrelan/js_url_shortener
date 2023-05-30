# Pemendek URL dengan Fitur Login/Register

Proyek ini adalah sebuah aplikasi web sederhana yang memungkinkan pengguna untuk memendekkan URL dan menyimpannya ke dalam database. Aplikasi ini juga dilengkapi dengan fitur login dan register untuk mengelola pengguna.

## Fitur

- Pemendekan URL: Pengguna dapat memasukkan URL panjang dan mendapatkan URL pendek sebagai hasilnya.
- Login: Pengguna dapat login menggunakan username dan password yang terdaftar.
- Register: Pengguna dapat membuat akun baru dengan menyediakan username dan password.
- Otorisasi: Hanya pengguna yang telah login yang dapat menggunakan fitur pemendekan URL.
- Penyimpanan Database: URL yang telah dipendekkan disimpan ke dalam database dan terhubung dengan akun pengguna yang menghasilkannya.

## Komponen yang Diperlukan

- Node.js: Pastikan Node.js sudah terinstal di sistem Anda. Unduh di https://nodejs.org.
- MongoDB: Pastikan MongoDB sudah terinstal di sistem Anda. Unduh di https://www.mongodb.com.

## Cara Menginstal

1. Clone repositori ini ke direktori lokal Anda:

```shell
git clone https://github.com/VideFrelan/js_url_shortener.git
```
2. Masuk ke direktori proyek
```shell
cd js_url_shortener
```
3. Instal dependensi menggunakan npm:
```shell
npm install
```
4. Konfigurasi Database:
Pastikan MongoDB telah berjalan di sistem Anda.
Buka file app.js dan sesuaikan URL koneksi MongoDB sesuai dengan konfigurasi Anda:
```js
mongoose.connect('mongodb://localhost/js_url_shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
```
Pastikan juga Anda telah mengatur konfigurasi lainnya yg diperlukan.

5. Jalankan aplikasi
```shell
node app.js
```
6. Buka browser dan akses http://localhost:3000 untuk mengakses aplikasi.

## Menyesuaikan data pengguna
Dalam proyek ini, data pengguna disimpan di dalam database MongoDB. Untuk mengubah data pengguna, Anda perlu memodifikasi file `app.js`. Di dalam file ini, Anda dapat menyesuaikan skema pengguna sesuai dengan kebutuhan Anda.
```js
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});
```