import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: "lars-div",
  region: "auto",
  endpoint: "https://387d5dfbffcb6ab5025fcc5b7d38e68e.r2.cloudflarestorage.com/lars-div",
});
