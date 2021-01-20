

const { db } = require("./database")
const randomItem = require('random-item');


exports.handler = async (req, res) => {
    const seg = db.get("segments")
    .filter({rating: 5})
    .value()
    res.status(200);
    res.send({
        segment: randomItem(seg),
        total: seg.length
    });
    // res.status(400);
    // res.send({
    //     error: {
    //         message: "error",
    //     },
    // });
};
