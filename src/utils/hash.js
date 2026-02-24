const bcrypt = require('bcrypt');
module.exports = {
  hash: async (plain) => bcrypt.hash(plain, 10),
  compare: async (plain, hash) => bcrypt.compare(plain, hash)
};