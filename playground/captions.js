

//scraper.js
require("dotenv").config()
const axios = require("axios").default;

const cheerio = require("cheerio")
const videoIds = [
    // "K_QKabwLlds",
    // "5CbRL60hHi4",
    "oB5Vaq2dsEc",
    "wwNZKfBLAsc",
    "DxqI1M0hdMg",
    "kGLI3e6jFNg",
    "abxAuRdPSCE",
    "p2Z5x3EmZc8",
    "UWkyyhxPiiw",
    "NmInozbd8gA",
    "GpvP4xI5phk",
    "mHl--iqe4xw",
    "M2_tmKz3gBI",
    "ud91woekqMM"
]

const {db} = require("../functions/db/database")
const { nanoid } = require("nanoid")
// axios.get(`https://www.googleapis.com/youtube/v3/captions/?videoId=${videoId}&part=snippet&key=${process.env.YOUTUBE_API_KEY}`)
//     .then(a => {
//         a.data.items.forEach(d => {
//             console.log('d: ', d);

// axios.get(`https://www.googleapis.com/youtube/v3/captions/${d.id}?key=${process.env.YOUTUBE_API_KEY}`)
//     .then(a => {
//         console.log("body", a.body)
//         console.log("data", a.data)
//     })
//         })
//     })
// .catch(err => {
//     // console.log('err: ', err);

// })

// axios.get(`https://youtube.googleapis.com/youtube/v3/captions/geti0jP0alzWmWeqO20_Tl-QcBfuaQAU?key=${process.env.YOUTUBE_API_KEY}`)
//     .then(a => {
//         console.log("body", a.body)
//         console.log("data", a.data)
//     })
//     .catch(err => {
//         // console.log('err: ', err);
//         console.log('err.response.data: ', err.response.data);

//     })

const arr = []
const go = async => {
    for (const videoId of videoIds){
        axios.get(`http://video.google.com/timedtext?lang=fr&v=${videoId}`)
            .then(a => {
                console.log("body", a.body)
                console.log("data", a.data)
                var $ = cheerio.load(a.data, {
                    xmlMode: true
                });
                $('text').each(function (i, text) {
                    var start = $(this).attr('start');
                    var dur = $(this).attr('dur');
                    db.get("segments")
                    .push({
                        id: nanoid(8),
                        videoId: videoId,
                        from:start * 1000,
                        to:(start * 1000) + (dur * 1000),
                        text: $(this).text()
                        .replaceAll("&quot;", '"')
                        .replaceAll("&#39;", "'")
                    })
                    .write()
        
                });
                console.log(arr)
            })
            .catch(err => {
                // console.log('err: ', err);
                console.log('err.response.data: ', err.response.data);
        
            })
    }

}

go()