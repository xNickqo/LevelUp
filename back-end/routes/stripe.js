const express = require('express');
const router = express.Router();
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/checkout', async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.nombre,
            description: item.descripcion,
          },
          unit_amount: item.precio * 100,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: 'http://localhost:4200/#/shop?payment=success',
      cancel_url: 'http://localhost:4200/#/shop',
    });

    res.status(200).json({ id: session.id });

  } catch (error) {
    console.error('Error al crear la sesión:', error);
    res.status(500).json({ error: 'Algo salió mal al crear la sesión de pago.' });
  }
});

module.exports = router;
