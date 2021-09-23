// ! Core Modules imports
const path = require('path');

// ! NPM  Modules imports
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');

// ! Util Imports
const DB_CONNECT = require('./utils/db');
const User = require('./models/user.model');

// ! App settings
const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', 'views');
const store = MongoDBStore({
  uri: process.env.A_DB_URI,
  collection: 'sessionstorecollection',
});
const fsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/user/uploads/images/temp');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/bmp'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// ! App Middlewares
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    cookie: {
      maxAge: 12 * 60 * 60 * 1000,
    },
    secret: 'qetuoadgjl',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(multer({ storage: fsStorage, fileFilter }).single('image'));
app.use(flash());
app.use(async (req, res, next) => {
  // console.log(req.session.loggedin);
  if (req.session.loggedin) {
    // console.log(req.session.username);
    // console.log(req.session.uid);
    const tempUser = await User.findOne({ _id: req.session.uid });
    req.user = tempUser;
  }
  next();
});

// app.use((req, res, next) => {
//   console.log('logging hueheu');
//   console.log(req?.user);
//   next();
// });

// ! Route Imports
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const postRoutes = require('./routes/post');
const searchRoutes = require('./routes/search');
const asyncRoutes = require('./routes/async');

// ! Route Middlewares
app.use('/auth', authRoutes);
app.use('/', homeRoutes);
app.use('/', postRoutes);
app.use('/', searchRoutes);
app.use('/async', asyncRoutes);

// ! Test Route
app.get('/test', (req, res) => {
  res.render('login', {
    accountCreated: '',
  });
});

DB_CONNECT(process.env.A_DB_URI)
  .then(() => {
    console.log(`DB Connected`);
    return app.listen(PORT);
  })
  .then(() => {
    console.log(`Server Started at ${PORT}`);
  })
  .catch((err) => {
    console.log('Could not connect to database');
  });
