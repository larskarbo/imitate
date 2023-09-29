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

  getSheets: procedure.query(async ({ input }) => {
    const keys = await kv.keys("sheet:*");

    // Extract the namespaces from the keys
    const namespaces = keys.map((key) => {
      // Key format is 'sheet:{namespaceName}:item:{id}'
      const parts = key.split(":");
      return parts[1]; // Namespace is the second part of the split string
    });

    // Use a Set to remove duplicate namespaces
    const uniqueNamespaces = Array.from(new Set(namespaces));

    return uniqueNamespaces;
  }),

  getItem: procedure
    .input(z.object({ id: z.number(), sheetNamespace: z.string() }))
    .query(async ({ input }) => {
      const { id, sheetNamespace } = input;
      const value = await kv.get(`sheet:${sheetNamespace}:item:${id}`);

      if (!value) {
        return null;
      }
      return value as Item
    }),

  setItem: procedure
    .input(
      z.object({
        id: z.number(),
        sheetNamespace: z.string(),
        item: z.any(),
        wavBlob: z.instanceof(Uint8Array).optional(),
        text: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, sheetNamespace, text, wavBlob } = input;
      const filePath = "temp.wav";

      const item: Item = {};

      if (wavBlob) {
        const object = await writeFile(filePath, wavBlob);

        const uploadedUrl = await uploadWavToS3(filePath);

				item.url = uploadedUrl;
      }

      if (text) {
        item.text = text;
      }

      await kv.set(`sheet:${sheetNamespace}:item:${id}`, item);

      return null;
    }),
});

export type Item = {
  url?: string;
  text?: string;
};

// export type definition of API
export type AppRouter = typeof appRouter;
