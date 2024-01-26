import { kv } from "@vercel/kv";
import { readFile, writeFile } from "fs/promises";
import { z } from "zod";
import { zodTiptapDoc } from "../../application/TipTap";
import { speechToText } from "../speech/speechToText";
import { procedure, router } from "../trpc";

import axios from "axios";

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
        wavUrl: z.string().url(), // Update the input schema to accept URL string
      })
    )
    .mutation(async ({ input }) => {
      const { wavUrl } = input;

      // Download the WAV file using the provided URL
      const response = await axios.get(wavUrl, {
        responseType: "arraybuffer",
      });
      const wavBlobArr = new Uint8Array(response.data);

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
      const existingItems = await getItemsFromSheet(sheetNamespace);

      if (items.length - existingItems.length < -2) {
        throw new Error("Too many items deleted");
      }

      if (process.env.NODE_ENV === "production") {
        console.log("items: ", JSON.stringify(items, null, 2));
      }

      await kv.set(`sheet:${sheetNamespace}:items`, items);
      return null;
    }),
  deleteSheet: procedure
    .input(z.object({ sheetNamespace: z.string() }))
    .mutation(async ({ input }) => {
      const { sheetNamespace } = input;

      // Check if the sheet exists
      const sheetExists = await kv.exists(`sheet:${sheetNamespace}:items`);
      if (!sheetExists) {
        throw new Error("Sheet does not exist");
      }

      // Delete the sheet
      await kv.del(`sheet:${sheetNamespace}:items`);

      return null;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

const getItemsFromSheet = async (sheetNamespace: string) => {
  const items = await kv.get<Item[]>(`sheet:${sheetNamespace}:items`);

  return items!.filter((item) => item.id) as Item[];
};
