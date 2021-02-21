require("dotenv").config({
  path: __dirname + "/.env",
});
console.log(__dirname);
var ses = require("node-ses");
var client = ses.createClient({ key: process.env.SES_KEY, secret: process.env.SES_SECRET });

module.exports.sendEmail = (to, subject, message) => {
  return new Promise((resolve) => {
    client.sendEmail(
      {
        to: "",
        from: process.env.SES_FROM,
        subject: "greetings",
        message: "your <b>message</b> goes here",
        altText: "plain text",
      },
      function (err, data, res) {
        console.log("err: ", err);
        if (err) {
          throw err;
        }
        resolve();
      }
    );
  });
};
