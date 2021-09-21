const path = require('path');

console.log(
  path.join('/', 'assets', 'user', 'uploads', 'images').replace(/\\/g, '/')
);
