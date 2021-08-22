import Stripe from "stripe";
import { isDev, WEB_BASE } from "./webBase";

import { Request, Response } from "express";
import { getEnv } from "../../utils/getEnv";


const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2020-08-27",
});


const price = isDev
  ? "price_1JRCy3HspBoD23ZMQrKnA3WM"
  : "price_1JRCy3HspBoD23ZMQrKnA3WM";

export const checkout = async function (req: Request, res: Response) {
  const { studioId } = req.body;
  const priceId = price;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      metadata: {
        studioId: studioId,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
          // images:
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `${WEB_BASE}/thank-you-fpt?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${WEB_BASE}/french/pronunciation-course/intro`,
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    console.log("error", e.message);
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};
