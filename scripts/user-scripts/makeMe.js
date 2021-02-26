require("dotenv").config();

const axios = require("axios");

const BASE = `http://localhost:3200`;
// const BASE = `https://server.goimitate.com`;

const makeEmail=(email,token)=>{
  const link = `https://goimitate.com/app/set-password?email=${email}&token=${token}`
  const markdown = `
  **Hi!**
  
  Here is the link for setting the password for Imitate: LINK

  Let me know if you have problems logging in!

  Best,

  Lars
  `

  return md.render(markdown).replaceAll("LINK", link)
}

axios.post(BASE + "/registerWithToken", {
  email: "horse@horse.com",
}).then(asdf=>{
  console.log(asdf.data)
  // sendEmail(email, "Your Imitate account", html)
      // sendEmail(email, "Set you Imitate password here", makeEmail(email, asdf.data.token))
})
.catch(asdf => {
  console.log(asdf.response)
})

//https://goimitate.com/app/set-password?email=mail@larskarbo.no&token=jIPJdoxNHSWaD5JrwSoAOhR1Gxxeguj8oJvJlFZYRSYRe10u