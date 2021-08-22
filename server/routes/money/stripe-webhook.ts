// import { berequest } from "../../utils/berequest";
// import { slackNotify } from "../../utils/slackNotify";
import { Request, Response } from "express";
import Stripe from "stripe";
import { sendMail } from "../../mail/mail";
import { berequest } from "../../utils/berequest";
import { getEnv } from "../../utils/getEnv";
import { slackNotify } from "../../utils/slackNotify";
import marked from "marked";
import { getErrorMessage } from "../../utils/getErrorMessage";

const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2020-08-27",
});

const WEBHOOK_SECRET = getEnv("STRIPE_WEBHOOK_SECRET");
console.log("WEBHOOK_SECRET: ", WEBHOOK_SECRET);

export const stripeWebhook = async (req: Request, res: Response) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;

  console.log("req.rawBody: ", req.rawBody);
  console.log('req.headers["stripe-signature"]: ', req.headers["stripe-signature"]);
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers["stripe-signature"], WEBHOOK_SECRET);
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

      await berequest("POST", "/registerWithToken", {
        email: email,
      })
        .then((asdf) => {
          console.log("asdf: ", asdf);
          const { email, token } = asdf;
          const { text, html } = makeEmail(token);

          sendMail({
            toAddress: email,
            subject: "Access Imitate French Pronunciation Basics Here!",

            body_html: html,
            body_text: text,
          });
        })
        .catch((asdf) => {
          console.log("error: ", getErrorMessage(asdf));
          throw getErrorMessage(asdf);
        });
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

const makeEmail = (utoken) => {
  const link = `https://goimitate.com/app/set-password?utoken=${utoken}`;
  const template: string = `
  Hi!
  
  Thanks for buying French Pronunciation Basics on Imitate!

  Here is the link for setting the password and accessing the course: LINK

  Let me know if you have problems setting the password! Feel free to reply directy to this email.

  Best,

  Lars
  `;
  const text = template.replaceAll("LINK", link);

  return {
    text: text,
    html: marked(text),
  };
};
