const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const logger = require('./config/logger');

const port = process.env.PORT || 4000;

// Trata erros globais (evita crash silencioso)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

app.listen(port, () =>
  logger.info(`Backend rodando em http://localhost:${port}`)
);
