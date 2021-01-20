

//scraper.js
require("dotenv").config()
const axios = require("axios").default;

const cheerio = require("cheerio")
const fs = require("fs-extra")
const videoId = "EnPYXckiUVg"

const { db } = require("../functions/db/database")

const segments = db.get("segments")
    .filter({ rating: 5 })
    .value()

fs.writeJSON("prodDB.json", { segments: segments })