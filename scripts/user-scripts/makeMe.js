require("dotenv").config();

const axios = require("axios");

// const BASE = `http://localhost:3200`;
const BASE = `https://server.goimitate.com`;

axios.post(BASE + "/registerWithToken", {
  email: process.env.MY_EMAIL,
}).then(asdf=>{
  console.log(asdf.data)
  // sendEmail(email, "Your Imitate account", html)
})
.catch(asdf => {
  console.log(asdf.response)
})

//https://goimitate.com/app/set-password?email=mail@larskarbo.no&token=jIPJdoxNHSWaD5JrwSoAOhR1Gxxeguj8oJvJlFZYRSYRe10u