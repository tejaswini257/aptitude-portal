const bcrypt = require('bcrypt');
console.log(bcrypt.compareSync('wrongpassword', '$2b$10$UaUa2aU1UaUaUaUaUaUaU.'));
