const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database");
const { urlAlphabet, customAlphabet } = require("nanoid");
const { encrypt } = require("./encrypt");
const { alphanumeric } = require("nanoid-dictionary");
const id = customAlphabet(alphanumeric, 48);

export const registerWithToken = async (req, res) => {
  var name = req.body.name;
  var email = req.body.email;

  if (!name) {
    // return res.status(400).send({ message: "name is missing" });
  }
  if (!email) {
    return res.status(400).send({ message: "email is missing" });
  }
  // if (!password) {
  //   return res.status(400).send({ message: "password is missing" });
  // }

  const userExists = false;
  if (userExists) {
    res.status(409).send({ success: false, message: "email already in use" });
  } else {
    const token = id(48);
    const tokenHash = await encrypt(token);

    db.pool
      .query("INSERT INTO users (name, email, token_hash) VALUES ($1, $2, $3) RETURNING *", [name, email, tokenHash])
      .then((hey) => {
        console.log('hey: ', hey);
        console.log('hey: ', hey?.rows?.[0].id);
        //use the payload to store information about the user such as email, user role, etc.

        db.pool
          .query(
            `INSERT INTO user_tokens (token, password_reset, user_id, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '1 day') RETURNING *`,
            [token, true, hey?.rows?.[0].id]
          )
        res.send({
          email,
          token,
        });
      })
      .catch((err) => {
        if (err?.constraint == "users_email_key") {
          res.status(400).send({ message: "Email already exists" });
          return;
        }
        res.status(400).send({ err: err });
      });
  }
};
