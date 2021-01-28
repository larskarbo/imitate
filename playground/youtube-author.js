//scraper.js
const axios = require('axios')
require("dotenv").config();

const { db } = require("../functions/db/database");

const segments = db.get("segments").filter({ rating: 5 }).value();

segments
  .filter((s) => !s.channel)
  .forEach((s) => {
      console.log(`https://www.googleapis.com/youtube/v3/videos?id=${s.videoId}&part=contentDetails,snippet&key=${process.env.YOUTUBE_API_KEY}`)
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?id=${s.videoId}&part=contentDetails,snippet&key=${process.env.YOUTUBE_API_KEY}`
      )
      .then((a) => {
        db.get("segments").find({ id: s.id })
        .assign({ channel: {
            channelId: a.data.items[0].snippet.channelId,
            channelTitle: a.data.items[0].snippet.channelTitle
        } })
        .write()
        console.log("yes")
      });
  });
