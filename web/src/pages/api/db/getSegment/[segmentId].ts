import { segments } from "../prodDB.json";

export default async function handler(req, res) {
  const { segmentId } = req.query
  const seg = segments.find((s) => s.id == segmentId);

  res.status(200).json({
    segment: seg,
  });
}
