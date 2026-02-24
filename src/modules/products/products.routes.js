const express = require('express');
const router = express.Router();
const controller = require('./products.controller');
const auth = require('../../middlewares/authMiddleware');
const requireAdmin = require('../../middlewares/requireAdmin');

// Rotas públicas
router.get('/', controller.list);
router.get('/:id', controller.getById);

// Rotas para ADMIN
router.post('/', auth, requireAdmin, controller.create);
router.put('/:id', auth, requireAdmin, controller.update);
router.delete('/:id', auth, requireAdmin, controller.remove);

module.exports = router;
