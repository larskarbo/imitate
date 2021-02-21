const fs = require("fs-extra");
const Timecode = require("smpte-timecode");
const execSync = require("child_process").execSync;
var ffmpeg = require("fluent-ffmpeg");

// const INFILE = "sounds-explains.mov"
// const OUT = "out-explains"
// const COLOR = "nge"

// const names = [
//   "sound-lit-explain",
//   "sound-fondue-explain",
//   "sound-loup-explain",
//   "sound-thé-explain",
//   "sound-mère-explain",
//   "sound-feu-explain",
//   "sound-cœure-explain",
//   "sound-plage-explain",
//   "sound-bateau-explain",
//   "sound-corps-explain",
//   "nasals-explain",
//   "sound-pain-explain",
//   "sound-plante-explain",
//   "sound-bonjour-explain",
//   "sound-doigt-explain",
// ];


const INFILE = "sounds.mov"
const OUT = "out"
const COLOR = "en"

const content = require("../../src/course/content.json")

const exercises = content.reduce((acc, cur) => {
  if(cur.exercises){
    return [...acc, ...cur.exercises]
  }
  return acc
}, [])
const names = exercises.map(e => e.id);

// INIT
fs.emptyDirSync(OUT);
const mkdirp = require("mkdirp");
mkdirp(OUT);

// tl to json
code = execSync("csvtojson tl.csv > tl.json");

const tl = require("./tl.json");

const segments = tl.filter((t) => t.V == "V1").filter((t) => t.Color == COLOR);
if(segments.length != names.length){
  throw new Error("wrong" + segments.length + " " + names.length)
}

const firstTimeCode = () => Timecode(segments[0]["Record In"], 30);

const tcToString = (tc) => {
  console.log("tc: ", tc);
  return (
    tc.hours.toString().padStart(2, "0") +
    ":" +
    tc.minutes.toString().padStart(2, "0") +
    ":" +
    tc.seconds.toString().padStart(2, "0") +
    "." +
    Math.round((tc.frames / 30) * 1000)
  );
};


let segmentsToCut = segments.map((element) => {
  const fromTime = Timecode(element["Record In"], 30).subtract(firstTimeCode())
  const toTime = Timecode(element["Record Out"], 30).subtract(firstTimeCode())
  const diff = Timecode(toTime).subtract(Timecode(fromTime));
  return {
    // firstTimeCode: lol(firstTimeCode()),
    from: fromTime,
    // recordIn: element["Record In"],
    to: toTime,
    duration: diff.seconds + diff.frames / 30,
    fromTime: tcToString(fromTime),
    toTime: tcToString(toTime),
    // recordOut: element["Record Out"],
  }
});


(async () => {
  // const paths = await globby(['*.avi']);

  //=> ['unicorn', 'rainbow']
  let i = 0;
  for (const marker of segmentsToCut) {
    await new Promise((resolve) => {
      // fs.copyFileSync(p, "out/" + slugify(names[i]) + ".avi")
      ffmpeg("./"+INFILE)
        .setStartTime(tcToString(marker.from)) //Can be in "HH:MM:SS" format also
        .setDuration(marker.duration) //Can be in "HH:MM:SS" format also
        .on("start", function (commandLine) {
          console.log("Spawned FFmpeg with command: " + commandLine);
        })
        .on("error", function (err) {
          console.log("error: ", +err);
        })
        .on("end", function (err) {
          if (!err) {
            console.log("conversion Done");
            resolve();
          }
        })
        .saveToFile("./"+OUT+"/" + names[i] + ".mp4");
      i++;
    });
  }
})();
