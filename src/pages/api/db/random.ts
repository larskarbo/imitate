import { dbObject } from "./prodDB";
import { sample } from "lodash";

export default async function handler(req, res) {
  const seg = dbObject.segments;
  res.status(200).json({
    segment: sample(seg),
    total: seg.length,
  });
}
