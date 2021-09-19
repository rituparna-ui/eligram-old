// ! Core Modules imports

// ! NPM  Modules imports
const express = require('express');
const cors = require('cors');

// ! Util Imports
const DB_CONNECT = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ! App Middlewares
app.use(cors());

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
