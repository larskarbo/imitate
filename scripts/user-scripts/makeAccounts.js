const axios = require("axios");
var md = require('markdown-it')();
const execSync = require("child_process").execSync;

const {sendEmail} = require("./ses")

code = execSync("csvtojson fpb-buyers-all.csv > fpb-buyers-all.json");

const list = require("./fpb-buyers-all.json");

// const BASE = `http://localhost:3200`;
const BASE = `https://server.goimitate.com`;

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

(async () => {
  let i = 0;
  const listWithLars = [
    {
      Email: "larskarbo@gmail.com",
      Name: ""
    },
    // list
  ]
  for (const element of list) {
    const email = element.Email;
    const name = element.Name;
    
    await axios.post(BASE + "/registerWithToken", {
      email: email,
      name: name,
    }).then(asdf=>{
      console.log(asdf.data)
      sendEmail(email, "Set you Imitate password here", makeEmail(email, asdf.data.token))
    })
    .catch(asdf => {
      console.log(asdf.response)
    })
    i++;
  }
})();
