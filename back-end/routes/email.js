// backend/routes/email.js
const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

/**
 * @swagger
 * /email/send:
 *   post:
 *     summary: Enviar correo de invitación
 *     description: Envía un correo de suscripción al usuario indicado.
 *     tags:
 *       - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Faltan datos
 *       500:
 *         description: Error al enviar el correo
 */
router.post("/send", emailController.sendEmail);

module.exports = router;
