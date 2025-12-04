const express = require('express');
const {
  getCountries,
  getCountry
} = require('@level3/controllers/countryController');

const router = express.Router();

// Estas rutas son públicas (no requieren autenticación)
// ya que la información de países es general

router.get('/', getCountries);
router.get('/:codigo', getCountry);

module.exports = router;

