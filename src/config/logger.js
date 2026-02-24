const util = require('util');
module.exports = {
  info: (...args) => console.log('[INFO]', util.format(...args)),
  warn: (...args) => console.warn('[WARN]', util.format(...args)),
  error: (...args) => console.error('[ERROR]', util.format(...args))
};