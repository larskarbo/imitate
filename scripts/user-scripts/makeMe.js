require("dotenv").config();

const axios = require("axios");

// const BASE = `http://localhost:3200`;
const BASE = `https://server.imita.io`;

const makeEmail=(email,token)=>{
  const link = `https://imita.io/app/set-password?email=${email}&token=${token}`
  const markdown = `
  **Hi!**
  
  Here is the link for setting the password for Imita: LINK

  Let me know if you have problems logging in!

  Best,

  Lars
  `

  return md.render(markdown).replaceAll("LINK", link)
}

axios.post(BASE + "/registerWithToken", {
  email: "biblioklept@icloud.com",
}).then(asdf=>{
  console.log(asdf.data)
  console.log(`https://imita.io/app/set-password?email=${asdf.data.email}&token=${asdf.data.token}`)
  // sendEmail(email, "Your Imita account", html)
  sendEmail(email, "Set you Imita password here", makeEmail(email, asdf.data.token))
})
.catch(asdf => {
  console.log(asdf.response)
})

//https://imita.io/app/set-password?email=mail@larskarbo.no&token=jIPJdoxNHSWaD5JrwSoAOhR1Gxxeguj8oJvJlFZYRSYRe10u