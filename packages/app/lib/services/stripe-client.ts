import { loadStripe, Stripe } from "@stripe/stripe-js";
import StripeClient from "stripe";

export const stripe = new StripeClient(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? "",
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2020-08-27",
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: "Guys N Heat",
      version: "0.1.0",
    },
  }
);

let stripePromise: Promise<Stripe | null>;

export const getStripeClient = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
        ""
    );
  }

  return stripePromise;
};
