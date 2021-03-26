const bcrypt = require("bcrypt");
const db = require("../database");

export const verifyPasswordResetToken = async (req, res) => {
  var utoken = req.body.utoken;

  const userToken = (await db.pool.query("SELECT * FROM user_tokens WHERE token = $1", [utoken]))?.rows?.[0];
  console.log('userToken: ', userToken);
  if (!userToken) {
    res.status(401).send({ success: false, message: "email not found" });
    return;
  }


  const userValue = (await db.pool.query("SELECT * FROM users WHERE id = $1", [userToken.user_id]))?.rows?.[0];
  console.log('userValue: ', userValue);
  if (!userValue) {
    res.status(401).send({ success: false, message: "email not found" });
    return;
  }

  // if (!result) {
  //   res.status(401).send({ success: false, message: "wrong token" });
  //   return;
  // }

  res.send({
    success: true,
    email: userValue.email
  });
};