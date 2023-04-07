import { readFile, writeFile } from "fs/promises";
import { z } from "zod";
import { arrayBufferToWavBuffer } from "../../application/arrayBufferToWav";
import { blobToAudioBuffer } from "../../application/blobToAudioBuffer";
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
