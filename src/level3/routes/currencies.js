const express = require('express');
const {
  getCurrencies,
  getCurrency
} = require('@level3/controllers/currencyController');

const router = express.Router();

// Estas rutas son públicas (no requieren autenticación)
// ya que la información de monedas es general

router.get('/', getCurrencies);
router.get('/:codigo', getCurrency);

module.exports = router;

