const { db } = require("../database");
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
  if(req.user.role != "admin"){
    res.status(401).send({ success: false, message: "you need to be an admin to see this page" });
    return;
  }

  var username = req.body.username;
  var password = req.body.password;

  if(!username) {
    return res.status(400).send({message: "username is missing"})
  }
  if(!password) {
    return res.status(400).send({message: "password is missing"})
  }


  const user = db.get('users').find({username: username})

  if(!user.value()){
    return res.status(404).send({message: "could not find user"})
  }

  const passwordHash = await new Promise((resolve) => {
    bcrypt.hash(password, 10, function (err, hash) {
      // Store hash in your password DB.
      resolve(hash);
    });
  });
  user.assign({passwordHash}).write()

  //send the access token to the client inside a cookie
  res.send({
    success:true
  });
};
exports.changePassword = changePassword;
