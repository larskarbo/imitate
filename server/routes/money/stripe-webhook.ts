// import { berequest } from "../../utils/berequest";
// import { slackNotify } from "../../utils/slackNotify";
import { Request, Response } from "express";
import Stripe from "stripe";
import { getEnv } from "../../utils/getEnv";
import { slackNotify } from "../../utils/slackNotify";

const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2020-08-27",
});

const WEBHOOK_SECRET = getEnv("STRIPE_WEBHOOK_SECRET")

export const stripeWebhook = async (req: Request, res: Response) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"],
      WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err);
    console.log(`⚠️  Webhook signature verification failed.`);
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
    return res.sendStatus(400);
  }
  // Extract the object from the event.
  const dataObject = event.data.object;
  console.log("dataObject: ", dataObject);

  switch (event.type) {
    case "checkout.session.completed":
      console.log("event.data.object.metadata: ", event.data.object.metadata);
      const email = dataObject.customer_details.email;
      const studioId = dataObject.metadata.studioId;

      // we need to create a payment token
      slackNotify(`New purchase from user: ${email}. Studio video: ${studioId} `);

      // berequest("POST", `/studio/addVideoToRenderQueue/${studioId}`, {
      //   email: email,
      // });
      // const passwordHash = await encrypt(password)

      // const userValue = await queryOne(
      //   `INSERT INTO users (username, email, password_hash, plan, billing_schedule, stripe_customer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      //   [username, email, passwordHash, 'premium', billingSchedule, event.data.object.customer],
      // )

      res.send({});
      // console.log('event.data.object.metadata: ', event.data.object.metadata)

      // Payment is successful and the subscription is created.
      // You should provision the subscription.
      break;
    default:
      slackNotify(`Unhandled webhook!`);
      return res.send({ unhandled: "OK" });
    // Unexpected event type
  }
};
