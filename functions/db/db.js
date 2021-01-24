// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method


const express = require("express");
const app = express();
const serverless = require("serverless-http");
var bodyParser = require("body-parser");
app.use(bodyParser.json())

const router = express.Router();

router.post("/rate", require("./rate").handler);
router.get("/random", require("./randomDev").handler);
router.get("/getSegment/:segmentId", require("./getSegmentDev").handler);

// router.get("/random", require("./random").handler);
// router.get("/getSegment/:segmentId", require("./getSegment").handler);


app.use("/.netlify/functions/db", router);

// app.listen(1337)
module.exports.handler = serverless(app);
