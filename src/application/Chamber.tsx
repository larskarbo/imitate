import toWav from "audiobuffer-to-wav";
import { range } from "lodash";
import { useCallback, useState } from "react";
import { trpc } from "../utils/trpc";
import PlaybackBoat, { Region } from "./PlaybackBoat";
import RecordBoat, { Button } from "./RecordBoat";
import { blobToArrayBuffer, blobToAudioBuffer } from "./blobToAudioBuffer";
import WaveSurfer from "wavesurfer.js";

import { useDropzone } from "react-dropzone";

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
      <div className="w-full  flex flex-wrap">
        {range(5).map((i) => {
          return range(8).map((j) => {
            return <Box key={`${i}-${j}`} />;
          });
        })}
      </div>
    </div>
  );
}
const lastRegionAtom = atom(
  null as {
    region: Region;
    blobUrl: string;
  } | null
);
const Box = () => {
  const [recording, setRecording] = useState<{
    blobUrl: string;
  } | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [region, setRegion] = useState<Region | null>(null);
  const [lastRegion, setLastRegion] = useAtom(lastRegionAtom);

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
    <div className="relative h-48 sm:w-72 w-full border border-gray-400  flex flex-col items-center bg-gray-200">
      <Uploader
        onAudio={(blobUrl) => {
          setRecording({ blobUrl });
        }}
      />
      <div className="flex gap-2 z-10">
        <RecordBoat
          onRecordFinish={async ({ blobUrl, chunks, blob }) => {
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
        <Button
          onClick={() => {
            wavesurfer?.playPause();
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          onClick={() => {
            wavesurfer?.stop();
            setRecording(null);
          }}
        >
          Clear
        </Button>
        <Button
          onClick={async () => {
            if (!lastRegion) return;
            // wavesurfer?.stop();
            // setRecording(null);
            console.log("lastRegion: ", lastRegion);
            const from = lastRegion.region.start;
            console.log("from: ", from);
            const to = lastRegion.region.end;
            console.log("to: ", to);

            const blob = await fetch(lastRegion.blobUrl).then((r) => r.blob());
            const newBlob = await trimBlob(blob, from, to);
            const newBlobUrl = URL.createObjectURL(newBlob);
            setRecording({
              blobUrl: newBlobUrl,
            });
          }}
          disabled={!lastRegion}
        >
          from s
        </Button>
      </div>
      {recording && (
        <PlaybackBoat
          key={recording.blobUrl}
          blobUrl={recording.blobUrl}
          onSetWavesurfer={setWavesurfer}
          onRegionUpdate={(region) => {
            setRegion(region);
            if (!region) {
              setLastRegion(null);
            } else {
              setLastRegion({
                region,
                blobUrl: recording.blobUrl,
              });
            }
          }}
        />
      )}
    </div>
  );
};

import decodeAudio from "audio-decode";
import { trimSilence } from "./trimSilence";
import { audioBufferToBlob } from "./audioBufferToBlob";
import { atom, useAtom, useSetAtom } from "jotai";
import { trimBlob } from "./trimBlob";
const Uploader = ({ onAudio }: { onAudio: (blobUrl: string) => void }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]!;

    const arrayBuffer = await blobToArrayBuffer(file);

    const audioBuffer = await decodeAudio(arrayBuffer);

    // const audioBufferCleaned = await trimSilence(audioBuffer);

    const newBlob = await audioBufferToBlob(audioBuffer);

    const blobUrl = URL.createObjectURL(newBlob);

    onAudio(blobUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div
      {...getRootProps()}
      className="absolute top-0 left-0 w-full h-full "
      style={
        {
          // pointerEvents: "none",
        }
      }
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here ...</p> : <p></p>}
    </div>
  );
};
