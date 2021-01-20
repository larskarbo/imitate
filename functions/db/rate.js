

const { db } = require("./database")
const randomItem = require('random-item');


exports.handler = async (req, res) => {
    console.log(req.body)

    db.get("segments").find({ id: req.body.segmentId })
        .assign({ rating: 5 })
        .write()

    res.status(200);
    res.send({
        segment: {}
    });

    // res.status(400);
    // res.send({
    //     error: {
    //         message: "error",
    //     },
    // });
};
