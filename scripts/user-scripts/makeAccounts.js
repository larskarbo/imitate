const axios = require("axios");

const execSync = require("child_process").execSync;

code = execSync("csvtojson fpb-buyers-all.csv > fpb-buyers-all.json");

const list = require("./fpb-buyers-all.json");

const BASE = `http://localhost:3200`;

(async () => {
  let i = 0;
  for (const element of list) {
    const email = element.Email;
    const name = element.Name;
    // if (i > 1) {
    //   continue;
    // }

    await axios.post(BASE + "/registerWithToken", {
      email: email,
      name: name,
    }).then(asdf=>{
      console.log(asdf.data)
    })
    // fs.copyFileSync(p, "out/" + slugify(names[i]) + ".avi")
    // console.log("element: ", element);
    i++;
  }
})();
