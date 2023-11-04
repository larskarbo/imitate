import { kv } from "@vercel/kv";
import { readFile, writeFile } from "fs/promises";
import { z } from "zod";
import { uploadWavToS3 } from "../s3";
import { speechToText } from "../speech/speechToText";
import { procedure, router } from "../trpc";

export type Item = z.infer<typeof itemSchema>;
const itemSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  text: z.union([z.string(), zodTiptapDoc]).optional(),
  isRecording: z.boolean().optional(),
  dataGrid: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
  }),
});

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

  getItems: procedure
    .input(z.object({ sheetNamespace: z.string() }))
    .query(async ({ input }) => {
      const { sheetNamespace } = input;
      const values = await getItemsFromSheet(sheetNamespace);

      if (!values || values.length === 0) {
        return null;
      }

      return values;
    }),

  setItem: procedure
    .input(
      z.object({
        id: z.string(),
        sheetNamespace: z.string(),
        item: itemSchema,
        text: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, item, sheetNamespace } = input;
      console.log("item: ", item);
      const items = await getItemsFromSheet(sheetNamespace);

      const newItems = items.map((i) => {
        if (i.id === id) {
          return item;
        }
        return i;
      });

      // if ID is not found, add it
      if (!items.find((i) => i.id === id)) {
        newItems.push(item);
      }

      await kv.set(`sheet:${sheetNamespace}:items`, newItems);

      return null;
    }),

  saveItems: procedure
    .input(
      z.object({
        sheetNamespace: z.string(),
        items: z.array(itemSchema),
      })
    )
    .mutation(async ({ input }) => {
      const { items, sheetNamespace } = input;
      await kv.set(`sheet:${sheetNamespace}:items`, items);

      return null;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
import { Layout } from "react-grid-layout";
import { zodTiptapDoc } from "../../application/TipTap";

const getItemsFromSheet = async (sheetNamespace: string) => {
  const items = await kv.get<Item[]>(`sheet:${sheetNamespace}:items`);

  return items!.filter((item) => item.id) as Item[];
};
