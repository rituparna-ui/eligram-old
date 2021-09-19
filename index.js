// ! Core Modules imports

// ! NPM  Modules imports
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
