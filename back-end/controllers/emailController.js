// backend/controllers/emailController.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Función para enviar el correo
const sendEmail = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Correo electrónico inválido' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Suscríbete a Level Up y desbloquea ventajas exclusivas 🎮',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; border: 1px solid #ccc;">
        <h2 style="color: #2c3e50;">🎮 ¡Forma parte del equipo Level Up!</h2>
        <p>Hola,</p>
        <p>Queremos invitarte a unirte a nuestra comunidad de apasionados por los videojuegos retro.</p>
        <p>Por solo <strong>5€ al mes</strong>, obtendrás acceso exclusivo a:</p>
        <ul>
          <li>🎁 Productos únicos y ofertas especiales</li>
          <li>👾 Comunidad privada con beneficios</li>
          <li>📦 Envíos prioritarios</li>
        </ul>
        <p>No dejes pasar esta oportunidad. ¡El viaje apenas comienza!</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="" style="background-color: #3498db; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Suscribirme ahora</a>
        </p>
        <p>Gracias por tu interés,<br><strong>El equipo de Level Up</strong></p>
      </div>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a', email);
    res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ success: false, error: 'Error al enviar el correo' });
  }
};

module.exports = { sendEmail };
