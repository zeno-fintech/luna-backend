const express = require('express');
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} = require('@level3/controllers/profileController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Profiles
 *     description: Gestión de perfiles financieros
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/profiles:
 *   get:
 *     summary: Obtiene todos los perfiles del usuario autenticado
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [persona, empresa]
 *         description: Filtrar por tipo de perfil
 *     responses:
 *       200:
 *         description: Lista de perfiles
 *       401:
 *         description: No autenticado
 *   post:
 *     summary: Crea un nuevo perfil financiero
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombrePerfil
 *               - tipo
 *             properties:
 *               nombrePerfil:
 *                 type: string
 *                 description: Nombre del perfil (también acepta 'nombre' como alias)
 *                 example: Franco
 *               nombre:
 *                 type: string
 *                 description: Alias de nombrePerfil (se mapea automáticamente)
 *                 example: Franco
 *               tipo:
 *                 type: string
 *                 enum: [persona, empresa]
 *                 description: Tipo de perfil. Acepta 'persona', 'empresa', 'Personal' o 'Empresa' (se normaliza automáticamente)
 *                 example: persona
 *               moneda:
 *                 type: string
 *                 description: Moneda del perfil (se mapea a configuracion.moneda). Ej: CLP, USD, EUR
 *                 example: CLP
 *               configuracion:
 *                 type: object
 *                 properties:
 *                   moneda:
 *                     type: string
 *                     example: CLP
 *                   pais:
 *                     type: string
 *                     example: CL
 *               informacionBasica:
 *                 type: object
 *                 properties:
 *                   nombres:
 *                     type: string
 *                     example: Franco
 *                   apellidos:
 *                     type: string
 *                     example: Castro
 *                   correo:
 *                     type: string
 *                     format: email
 *                     example: franco@example.com
 *                   telefono:
 *                     type: string
 *                     example: +56912345678
 *     responses:
 *       201:
 *         description: Perfil creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.route('/')
  .get(getProfiles)
  .post(createProfile);

/**
 * @swagger
 * /api/v1/profiles/{id}:
 *   get:
 *     summary: Obtiene un perfil específico por ID
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del perfil
 *     responses:
 *       200:
 *         description: Información del perfil
 *       404:
 *         description: Perfil no encontrado
 *   put:
 *     summary: Actualiza un perfil existente
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       404:
 *         description: Perfil no encontrado
 *   delete:
 *     summary: Elimina un perfil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil eliminado exitosamente
 *       404:
 *         description: Perfil no encontrado
 */
router.route('/:id')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;

