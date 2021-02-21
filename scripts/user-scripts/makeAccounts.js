const axios = require("axios");
var md = require('markdown-it')();
const execSync = require("child_process").execSync;

code = execSync("csvtojson fpb-buyers-all.csv > fpb-buyers-all.json");

const list = require("./fpb-buyers-all.json");

// const BASE = `http://localhost:3200`;
const BASE = `https://server.goimitate.com`;

const makeEmail=(email,token)=>{
  const link = `https://goimitate.com/app/set-password?email=${email}&token=${token}`
  console.log('link: ', link);
  const markdown = `
  # Hi!

  Here is the link for accessing Imitate: [set password](LINK)

  `

  return md.render(markdown).replaceAll("LINK", link)
}

(async () => {
  let i = 0;
  for (const element of list) {
    const email = element.Email;
    const name = element.Name;
    if (i >= 1) {
      continue;
    }
    console.log(makeEmail(email, "horse"))
    return
    await axios.post(BASE + "/registerWithToken", {
      email: email,
      name: name,
    }).then(asdf=>{
      console.log(asdf.data)
      // sendEmail(email, "Your Imitate account", html)
    })
    .catch(asdf => {
      console.log(asdf.response)
    })
    i++;
  }
})();
