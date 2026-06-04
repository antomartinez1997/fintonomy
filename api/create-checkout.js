// api/create-checkout.js
// Creates a Stripe checkout session with 14-day free trial

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, plan = 'monthly' } = req.body;

    const priceId = plan === 'yearly'
      ? process.env.STRIPE_PRICE_YEARLY   // 79€/year
      : process.env.STRIPE_PRICE_MONTHLY; // 9€/month

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
      },
      success_url: `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/paywall`,
      locale: 'es',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: 'Error creando sesión de pago' });
  }
}
