const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../database");
const { encrypt } = require("./encrypt");


const Joi = require('joi')
const passwordSchema = Joi.string().min(6).required()

const schema = Joi.object({
  password: passwordSchema,
  token: Joi.string().required(),
})
export const setPassword = async (req, res) => {
  const validate = schema.validate({
    token: req.body.token,
    password: req.body.password,
  })

  if (validate.error) {
    const { details } = validate.error
    const message = details.map((i) => i.message).join(',')

    return res.status(422).json({ error: message })
  }

  const { token, password } = validate.value

  const user_token_doc = (await db.pool.query("SELECT * FROM user_tokens WHERE token = $1", [token]))?.rows?.[0];
  console.log('user_token_doc: ', user_token_doc);
  if (!user_token_doc) {
    res.status(401).send({ success: false, message: "token not matching anything" });
    return;
  }

  const passwordHash = await encrypt(password)
  console.log('passwordHash: ', passwordHash);

  db.pool.query(`UPDATE users SET password_hash=$1, email_verified=TRUE WHERE id=$2`, [passwordHash, user_token_doc.user_id]).then((hey) => {
    res.send({
      sucess: true,
    });
  }).catch(err => {
    res.status(400).send({ err: err });
  })
};