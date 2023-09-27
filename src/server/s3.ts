//Native ES import didn't work.

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3") as {
  S3Client: typeof import("@aws-sdk/client-s3").S3Client;
  PutObjectCommand: typeof import("@aws-sdk/client-s3").PutObjectCommand;
};

import { getEnv } from "@larskarbo/get-env";
import { readFileSync } from "fs";

import { nanoid } from "nanoid";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://387d5dfbffcb6ab5025fcc5b7d38e68e.r2.cloudflarestorage.com/lars-div`,
  credentials: {
    accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
  },
});

export const uploadWavToS3 = async (filePath: string) => {
  // We will read file as a Buffer directly from file system
  const Body = readFileSync(filePath);

  // For WAV files, content type should be 'audio/wav'
  const ContentType = "audio/wav";

  // Generate a key using nanoid
  const Key = `imita/${nanoid()}.wav`;

  const params = {
    Bucket: "lars-div",
    Key,
    Body,
    ACL: "public-read",
    ContentType,
  };

  const command = new PutObjectCommand(params);
  await S3.send(command);

  // Construct and return the file url
  const fileUrl = `https://lars-div.larskarbo.no/lars-div/${Key}`;

  return fileUrl;
};
