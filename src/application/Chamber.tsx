import { useState } from "react";
import { Header } from "../course/Header";
import { trpc } from "../utils/trpc";
import { arrayBufferToWavBuffer } from "./arrayBufferToWav";
import { blobToAudioBuffer } from "./blobToAudioBuffer";
import RecordBoat from "./RecordBoat";
import toWav from "audiobuffer-to-wav";

export function Chamber() {
  const [recordings, setRecordings] = useState([]);

  const [isRecording, setIsRecording] = useState(false);

  const { data, mutate, isLoading } = trpc.transcribe.useMutation({});
  console.log("data: ", data);

  const blobToWav = async (blob: Blob) => {
    const audiobuffer = await blobToAudioBuffer(blob);
    const wav = toWav(audiobuffer);
    const wavBlob = new window.Blob([new DataView(wav)], {
      type: "audio/wav",
    });

    return {
      wavBlob,
    };
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen w-full">
      <Header />
      <div className="max-w-3xl flex flex-col items-center px-8 w-full pb-24">
        <div className="pb-8"></div>
        {isLoading && (
          <div className="text-center text-xl mb-4 font-medium">Loading...</div>
        )}
        {data && (
          <div className="text-center text-xl mb-4 font-medium">
            {data.text}{" "}
          </div>
        )}

        <RecordBoat
          onRecordFinish={async ({ blobUrl, chunks, sampleRate, blob }) => {
            console.log("sampleRate: ", sampleRate);
            console.log("chunks: ", chunks);
            setRecordings([{ blobUrl }, ...recordings]);

            const { wavBlob } = await blobToWav(blob);
            mutate({
              audioBlob: blobUrl,
              wavBlobArr: new Uint8Array(await wavBlob.arrayBuffer()),
            });
          }}
          onIsRecordingChange={setIsRecording}
        />
      </div>
    </div>
  );
}
