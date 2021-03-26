const jwt = require("jsonwebtoken");
import { sendMail, transporter } from "../mail/mail";
import marked from 'marked';
const bcrypt = require("bcrypt");
const db = require("../database");
const { customAlphabet } = require("nanoid");
const { alphanumeric } = require("nanoid-dictionary");
const genToken = customAlphabet(alphanumeric, 48);

export const forgotPassword = async (req, res) => {
  var email = req.body.email;

  if (!email) {
    return res.status(400).send({ message: "email is missing" });
  }

  const userValue = (await db.pool.query("SELECT * FROM users WHERE email = $1", [email]))?.rows?.[0];
  console.log("userValue: ", userValue);
  if (!userValue) {
    res.status(401).send({ message: "email not found" });
    return;
  }

  db.pool
    .query(
      `INSERT INTO user_tokens (token, password_reset, user_id, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '1 day') RETURNING *`,
      [genToken(), true, userValue.id]
    )
    .then((hey) => {

      const {text, html} = makeEmail(hey.rows[0].token)
      console.log('text: ', text);
      // // transporter
      sendMail({
        subject:"Imitate Password Reset",
        toAddress: userValue.email,
        body_html: html,
        body_text: text
      }).then(() => {
        res.send({status:"done"});

      })

    })
    .catch((err) => {
      console.log("err: ", err);
      res.status(400).send({ error: err });
    });
};

const makeEmail = (utoken) => {
  const link = `https://goimitate.com/app/set-password?utoken=${utoken}`;
  const template: string = `
  Hi!
  
  Here is the link for setting the password for Imitate: LINK

  Let me know if you have problems setting the password!

  Best,

  Lars
  `
  const text = template.replaceAll("LINK", link)

  return {
    text: text,
    html: marked(text),
  };
};
