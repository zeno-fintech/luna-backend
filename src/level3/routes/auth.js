const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe
} = require('@level3/controllers/authController');
const { protect } = require('@core/middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('nombres').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellidos').trim().notEmpty().withMessage('El apellido es requerido'),
  body('correo').isEmail().withMessage('Por favor ingresa un correo válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const loginValidation = [
  body('correo').isEmail().withMessage('Por favor ingresa un correo válido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

module.exports = router;

