const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const productsRoutes = require('./modules/products/products.routes');
const authRoutes = require('./modules/auth/auth.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);

app.get('/api/v1/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

module.exports = app;