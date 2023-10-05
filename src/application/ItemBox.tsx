import toWav from "audiobuffer-to-wav";
import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { trpc } from "../utils/trpc";
import PlaybackBoat, { Region } from "./PlaybackBoat";
import RecordBoat, { Button } from "./RecordBoat";
import { blobToAudioBuffer } from "./blobToAudioBuffer";
import { useAtom } from "jotai";
import { trimBlob } from "./trimBlob";
import { lastRegionAtom } from "./Chamber";
import { Uploader } from "./Uploader";

import { usePresignedUpload } from "next-s3-upload";
export const ItemBox = ({
  id,
  sheetNamespace,
}: {
  id: number;
  sheetNamespace: string;
}) => {
  const [recording, setRecording] = useState<{
    blobUrl: string;
    blob?: Blob;
    isRecording: boolean;
  } | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: fetchedItem } = trpc.getItem.useQuery({ id, sheetNamespace });

  let { uploadToS3 } = usePresignedUpload();

  useEffect(() => {
    if (!fetchedItem) return;
    console.log("fetchedItem: ", fetchedItem);

    if (fetchedItem.url) {
      setRecording({
        blobUrl: fetchedItem.url,
        isRecording: fetchedItem.isRecording || false,
      });
    }

    if (fetchedItem.text) {
      setText(fetchedItem.text);
    }
  }, [fetchedItem]);

  const { mutate: saveItem } = trpc.setItem.useMutation({
    onSuccess: () => {
      setIsDirty(false);
    },
  });

  const setNewRecording = async (
    blob: Blob,
    {
      isRecording,
    }: {
      isRecording: boolean;
    }
  ) => {
    const blobUrl = URL.createObjectURL(blob);

    setRecording({ blobUrl, blob, isRecording });
    setIsDirty(true);
  };

  const save = async () => {
    let recordingUrl: string | undefined = undefined;

    if (recording?.blob) {
      const res = await blobToWav(recording.blob);
      const wavBlob = new Uint8Array(await res.wavBlob.arrayBuffer());

      const blob = new Blob([wavBlob], { type: "audio/wav" });
      const file = new File([blob], "file.wav");
      const result = await uploadToS3(file);
      recordingUrl = `https://lars-div.larskarbo.no/lars-div/${result.key}`;
    }

    saveItem({
      id,
      sheetNamespace,
      recordingUrl: recordingUrl,
      isRecording: recording?.isRecording,
      text: text || undefined,
    });
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
    <div className="relative h-48 sm:w-72 w-full border border-gray-400  flex flex-col items-center bg-gray-200">
      <Uploader
        onAudio={(blob) => {
          // setRecording({ blobUrl });
          setNewRecording(blob, {
            isRecording: false,
          });
        }}
      />
      <div className="flex gap-2 z-10">
        <RecordBoat
          onRecordFinish={async ({ blobUrl, chunks, blob }) => {
            console.log("chunks: ", chunks);
            setNewRecording(blob, {
              isRecording: true,
            });
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
            const text = prompt("text");
            if (!text) return;
            setText(text);
            setIsDirty(true);
          }}
        >
          text
        </Button>
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
            setIsDirty(true);
          }}
        >
          Clear
        </Button>
        {lastRegion && (
          <Button
            onClick={async () => {
              if (!lastRegion) return;

              const from = lastRegion.region.start;
              const to = lastRegion.region.end;

              const blob = await fetch(lastRegion.blobUrl).then((r) =>
                r.blob()
              );
              const newBlob = await trimBlob(blob, from, to);
              setNewRecording(newBlob, {
                isRecording: lastRegion.isRecording,
              });
            }}
            disabled={!lastRegion}
          >
            froms
          </Button>
        )}
        {isDirty && (
          <Button
            onClick={async () => {
              await save();
            }}
          >
            Save
          </Button>
        )}
      </div>
      {recording && (
        <PlaybackBoat
          key={recording.blobUrl}
          blobUrl={recording.blobUrl}
          isRecording={recording.isRecording}
          onSetWavesurfer={setWavesurfer}
          onRegionUpdate={(region) => {
            setRegion(region);
            if (!region) {
              setLastRegion(null);
            } else {
              setLastRegion({
                region,
                blobUrl: recording.blobUrl,
                isRecording: recording.isRecording,
              });
            }
          }}
        />
      )}
      {text && <Text text={text} />}
    </div>
  );
};
import useFitText from "use-fit-text";

import { Textfit } from "react-textfit";
const Text = ({ text }: { text: string }) => {
  const { fontSize, ref } = useFitText();

  return (
    <div
      ref={ref}
      style={{ fontSize }}
      className="absolute bottom-0 right-0 top-0 left-0 p-2 font-serif text-6xl flex justify-center items-center"
    >
      {text}
    </div>
  );
};
