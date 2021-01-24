

const { db } = require("./database")
const randomItem = require('random-item');
const prodDB = require("./prodDB.json")


exports.handler = async (req, res) => {
    db.read()

    const seg = db.get("segments")
        .find({ id: req.params.segmentId })
        .value()
        
    res.status(200);
    res.send({
        segment: seg,
    });

    // res.status(400);
    // res.send({
    //     error: {
    //         message: "error",
    //     },
    // });
};
