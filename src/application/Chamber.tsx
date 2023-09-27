import toWav from "audiobuffer-to-wav";
import { range } from "lodash";
import { useCallback, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { trpc } from "../utils/trpc";
import PlaybackBoat, { Region } from "./PlaybackBoat";
import RecordBoat, { Button } from "./RecordBoat";
import { blobToArrayBuffer, blobToAudioBuffer } from "./blobToAudioBuffer";

import { useDropzone } from "react-dropzone";

export function Chamber({ namespace }: { namespace: string }) {
  const [recordCount, setRecordCount] = useAtom(recordingCountAtom);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
    // setTimeout(() => {
    // }, 5000);
  }, [firestore]);

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen w-full">
			<SheetPicker />
      <div className="max-w-3xl flex flex-col items-center px-8 w-full pb-24">
        <div className="pb-8"></div>
      S</div>
      Recordings: {recordCount}
      <div className="w-full  flex flex-wrap">
        {range(5).map((i) => {
          return range(8).map((j) => {
            const id = i * 8 + j;
            return <Box key={`${i}-${j}`} id={id} sheetNamespace={namespace} />;
          });
        })}
      </div>
    </div>
  );
}

export const recordingCountAtom = atom(0);

const lastRegionAtom = atom(
  null as {
    region: Region;
    blobUrl: string;
  } | null
);

const Box = ({
  id,
  sheetNamespace,
}: {
  id: number;
  sheetNamespace: string;
}) => {
  const [recording, setRecording] = useState<{
    blobUrl: string;
  } | null>(null);

  const { data: fetchedItem } = trpc.getItem.useQuery({ id, sheetNamespace });
  if (fetchedItem) {
    console.log("fetchedItem: ", fetchedItem);
  }

  useEffect(() => {
    if (!fetchedItem) return;

    console.log("fetchedItem.url: ", fetchedItem.url);
    setRecording({
      blobUrl: fetchedItem.url,
    });
  }, [fetchedItem]);

  const { mutate: saveItem } = trpc.setItem.useMutation({
    onError: (err) => {
      // alert(err);
    },
  });

  const saveNewRecording = async (blob: Blob) => {
    const { wavBlob } = await blobToWav(blob);
    const blobUrl = URL.createObjectURL(blob);

    saveItem({
      id,
      sheetNamespace,
      item: {
        recording: blobUrl,
        ab: wavBlob,
      },
      wavBlob: new Uint8Array(await wavBlob.arrayBuffer()),
    });

    setRecording({ blobUrl });
  };

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [region, setRegion] = useState<Region | null>(null);
  const [lastRegion, setLastRegion] = useAtom(lastRegionAtom);

  useEffect(() => {
    if (!wavesurfer) return;

    wavesurfer.on("play", () => {
      setIsPlaying(true);
    });
    wavesurfer.on("pause", () => {
      setIsPlaying(false);
    });
  }, [wavesurfer]);

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
    <div className="relative h-32 sm:w-72 w-full border border-gray-400  flex flex-col items-center bg-gray-200">
      <Uploader
        onAudio={(blob) => {
          // setRecording({ blobUrl });
          saveNewRecording(blob);
        }}
      />
      <div className="flex gap-2 z-10">
        <RecordBoat
          onRecordFinish={async ({ blobUrl, chunks, blob }) => {
            console.log("chunks: ", chunks);
            saveNewRecording(blob);
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

            const from = lastRegion.region.start;
            const to = lastRegion.region.end;

            const blob = await fetch(lastRegion.blobUrl).then((r) => r.blob());
            const newBlob = await trimBlob(blob, from, to);
            saveNewRecording(newBlob);
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
import { atom, useAtom } from "jotai";
import { audioBufferToBlob } from "./audioBufferToBlob";
import { firestore } from "./firebase";
import { trimBlob } from "./trimBlob";
import { SheetPicker } from "./SheetPicker";
const Uploader = ({ onAudio }: { onAudio: (blob: Blob) => void }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]!;

    const arrayBuffer = await blobToArrayBuffer(file);

    const audioBuffer = await decodeAudio(arrayBuffer);

    // const audioBufferCleaned = await trimSilence(audioBuffer);

    const newBlob = await audioBufferToBlob(audioBuffer);

    onAudio(newBlob);
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
