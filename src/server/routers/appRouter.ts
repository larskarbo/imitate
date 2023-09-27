import { kv } from "@vercel/kv";
import { readFile, writeFile } from "fs/promises";
import { z } from "zod";
import { uploadWavToS3 } from "../s3";
import { speechToText } from "../speech/speechToText";
import { procedure, router } from "../trpc";
export const appRouter = router({
  transcribe: procedure
    .input(
      z.object({
        audioBlob: z.string(),
        wavBlobArr: z.instanceof(Uint8Array),
      })
    )
    .mutation(async ({ input }) => {
      const { wavBlobArr } = input;
      const filePath = "temp.wav";
      await writeFile(filePath, wavBlobArr);
      const file = await readFile(filePath);

      const text = await speechToText(file, "");
      return {
        text,
      };
    }),

  getItem: procedure
    .input(z.object({ id: z.number(), sheetNamespace: z.string() }))
    .query(async ({ input }) => {
      const { id, sheetNamespace } = input;
      const value = await kv.get(`sheet:${sheetNamespace}:item:${id}`);

      if (!value) {
        return null;
      }
      return value as {
        url: string;
      };
    }),

  setItem: procedure
    .input(
      z.object({
        id: z.number(),
        sheetNamespace: z.string(),
        item: z.any(),
        wavBlob: z.instanceof(Uint8Array),
      })
    )
    .mutation(async ({ input }) => {
      const { id, sheetNamespace, item } = input;
      const { wavBlob } = input;
      const filePath = "temp.wav";
      await writeFile(filePath, wavBlob);

      const uploadedUrl = await uploadWavToS3(filePath);

      await kv.set(`sheet:${sheetNamespace}:item:${id}`, {
        url: uploadedUrl,
      });

      return null;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
