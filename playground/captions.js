

//scraper.js
require("dotenv").config()
const axios = require("axios").default;

const cheerio = require("cheerio")
const videoId = "t-LsjB45tOg"
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
axios.get(`http://video.google.com/timedtext?lang=fr&v=t-LsjB45tOg`)
    .then(a => {
        console.log("body", a.body)
        console.log("data", a.data)
        var $ = cheerio.load(a.data, {
            xmlMode: true
        });
        $('text').each(function (i, text) {
            var start = $(this).attr('start');
            var dur = $(this).attr('dur');
            arr.push({
                start:start,
                dur:dur,
                text: $(this).text()
            })

        });
        console.log(arr)
    })
    .catch(err => {
        // console.log('err: ', err);
        console.log('err.response.data: ', err.response.data);

    })