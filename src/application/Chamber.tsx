import toWav from "audiobuffer-to-wav";
import { range } from "lodash";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import PlaybackBoat from "./PlaybackBoat";
import RecordBoat from "./RecordBoat";
import { blobToAudioBuffer } from "./blobToAudioBuffer";

/*
next steps:
- cut start silence
- upload mp3
- speech to text
*/

export function Chamber() {
  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen w-full">
      <div className="max-w-3xl flex flex-col items-center px-8 w-full pb-24">
        <div className="pb-8"></div>
        {/* {isLoading && (
          <div className="text-center text-xl mb-4 font-medium">Loading...</div>
        )}
        {data && (
          <div className="text-center text-xl mb-4 font-medium">
            {data.text}{" "}
          </div>
        )} */}
      </div>
      <div className="w-full  grid grid-cols-5">
        {range(5).map((i) => {
          return range(8).map((j) => {
            return <Box key={`${i}-${j}`} />;
          });
        })}
      </div>
    </div>
  );
}

const Box = () => {
  const [recording, setRecording] = useState<{
    blobUrl: string;
  }>();

  const [isRecording, setIsRecording] = useState(false);

  const { data, mutate, isLoading } = trpc.transcribe.useMutation({});

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
    <div className="h-48">
      <RecordBoat
        onRecordFinish={async ({ blobUrl, chunks, sampleRate, blob }) => {
          console.log("sampleRate: ", sampleRate);
          console.log("chunks: ", chunks);
          setRecording({ blobUrl });

          const SPEECH_TO_TEX = false;
          if (!SPEECH_TO_TEX) return;
          const { wavBlob } = await blobToWav(blob);
          mutate({
            audioBlob: blobUrl,
            wavBlobArr: new Uint8Array(await wavBlob.arrayBuffer()),
          });
        }}
        onIsRecordingChange={setIsRecording}
      />
      {recording && (
        <PlaybackBoat
          key={recording.blobUrl}
          blobUrl={recording.blobUrl}
          autoPlay={false}
        />
      )}
    </div>
  );
};
