const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Konfigurasi MongoDB
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/pemendek-url', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Koneksi database error:'));
db.once('open', () => {
  console.log('Berhasil terhubung ke database');
});

// Definisikan skema dan model pengguna
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});
const User = mongoose.model('User', userSchema);

// Definisikan skema dan model URL pendek
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortenedUrl: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
const Url = mongoose.model('Url', urlSchema);

// Konfigurasi passport
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'Username tidak valid' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return done(err);
        if (res === false) {
          return done(null, false, { message: 'Password tidak valid' });
        }
        return done(null, user);
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Konfigurasi express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'secretKEY',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Middleware untuk menyimpan data user di dalam req.user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Halaman utama
app.get('/', (req, res) => {
  res.render('index');
});

// Halaman login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// Halaman register
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;
    const newUser = new User({
      username: username,
      password: hashedPassword,
    });
    newUser.save((err) => {
      if (err) throw err;
      req.flash('success', 'Akun berhasil dibuat. Silakan login');
      res.redirect('/login');
    });
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Anda berhasil logout');
  res.redirect('/');
});

// Simpan URL yang dipendekkan
app.post('/shorten', (req, res) => {
  const { originalUrl } = req.body;
  const shortenedUrl = generateShortUrl();
  const userId = req.user ? req.user._id : null; // Jika user sudah login, simpan ID user

  const newUrl = new Url({
    originalUrl: originalUrl,
    shortenedUrl: shortenedUrl,
    userId: userId,
  });

  newUrl.save((err) => {
    if (err) throw err;
    req.flash('success', 'URL berhasil dipendekkan');
    res.redirect('/');
  });
});

// Generate URL pendek acak
function generateShortUrl() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Jalankan server
const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});