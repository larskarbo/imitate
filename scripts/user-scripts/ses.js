require("dotenv").config();
console.log(__dirname);
var ses = require("node-ses");
var client = ses.createClient({ key: process.env.SES_KEY, secret: process.env.SES_SECRET });

module.exports.sendEmail = (to, subject, message) => {
  return new Promise((resolve) => {
    client.sendEmail(
      {
        to: to,
        from: process.env.SES_FROM,
        subject: subject,
        message: message
      },
      function (err, data, res) {
        if (err) {
          console.log("err: ", err);
          throw err;
        }
        resolve();
      }
    );
  });
};
