// ! Core Modules imports
const path = require('path');

// ! NPM  Modules imports
const express = require('express');
const cors = require('cors');

// ! Util Imports
const DB_CONNECT = require('./utils/db');

// ! App settings
const app = express();
const PORT = process.env.PORT || 3000;
app.set('view-engine', 'ejs');
app.set('views', 'views');

// ! App Middlewares
app.use(cors());
app.use('/assets',express.static(path.join(__dirname, 'assets')));

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
