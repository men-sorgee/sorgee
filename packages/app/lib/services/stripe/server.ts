import StripeClient from 'stripe';

const stripe = new StripeClient(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
  typescript: true,
  stripeAccount: process.env.STRIPE_ACCOUNT_ID,
  appInfo: {
    name: 'Guys N Heat',
    version: '0.1.0'
  }
})

export default stripe;