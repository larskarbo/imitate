

// const { db } = require("./database")
const randomItem = require('random-item');
const prodDB = require("./prodDB.json")


exports.handler = async (req, res) => {

    // const seg = db.get("segments")
    //     .find({ id: req.params.segmentId })
    //     .value()
    const seg = prodDB.segments
        .find(s => s.id == req.params.segmentId)
        
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
