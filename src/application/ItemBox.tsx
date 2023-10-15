import toWav from "audiobuffer-to-wav";
import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { trpc } from "../utils/trpc";
import PlaybackBoat, { ITEMBOX_HEIGHT, Region } from "./PlaybackBoat";
import RecordBoat, { Button } from "./RecordBoat";
import { blobToAudioBuffer } from "./blobToAudioBuffer";
import { useAtom } from "jotai";
import { trimBlob } from "./trimBlob";
import { focusedItemAtom, lastRegionAtom } from "./Chamber";
import { Uploader } from "./Uploader";
import slugify from "slugify";
import { usePresignedUpload } from "next-s3-upload";
export const ItemBox = ({
  id,
  sheetNamespace,
}: {
  id: number;
  sheetNamespace: string;
}) => {
  const [recording, setRecording] = useState<{
    wavOrBlobUrl: string;
    blob?: Blob;
    isRecording: boolean;
  } | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: fetchedItem } = trpc.getItem.useQuery({ id, sheetNamespace });

  let { uploadToS3 } = usePresignedUpload();

  useEffect(() => {
    if (!fetchedItem) return;

    if (fetchedItem.url) {
      if (fetchedItem.url.includes("blob")) {
        alert(`fetchedItem.url is blob where text is ${fetchedItem.text}`);
        return;
      }
      setRecording({
        wavOrBlobUrl: fetchedItem.url,
        isRecording: fetchedItem.isRecording || false,
      });
    }

    if (fetchedItem.text) {
      console.log(`fetchedItem.url for ${fetchedItem.text} `, fetchedItem.url);
      setText(fetchedItem.text);
    }
  }, [fetchedItem]);

  const { mutateAsync: saveItem } = trpc.setItem.useMutation({
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

    setRecording({ wavOrBlobUrl: blobUrl, blob, isRecording });
    setIsDirty(true);
  };

  const { mutate: save, isLoading: isLoadingSave } = useMutation(async () => {
    let recordingUrl: string | undefined = undefined;

    if (recording?.blob) {
      const res = await blobToWav(recording.blob);
      const wavBlob = new Uint8Array(await res.wavBlob.arrayBuffer());

      const blob = new Blob([wavBlob], { type: "audio/wav" });
      const file = new File([blob], "file.wav");
      const result = await uploadToS3(file);
      recordingUrl = `https://lars-div.larskarbo.no/lars-div/${result.key}`;
    } else if (recording?.wavOrBlobUrl) {
      recordingUrl = recording.wavOrBlobUrl;
    }

    if (recordingUrl?.includes("blob")) {
      throw new Error("recordingUrl is blob");
    }

    return saveItem({
      id,
      sheetNamespace,
      recordingUrl: recordingUrl,
      isRecording: recording?.isRecording,
      text: text || undefined,
    });
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [region, setRegion] = useState<Region | null>(null);
  const [lastRegion, setLastRegion] = useAtom(lastRegionAtom);
  const [focusedItem, setFocusedItem] = useAtom(focusedItemAtom);
  const isFocused = focusedItem === id;
  if (isFocused) console.log("isFocused: ", isFocused, { focusedItem, id });

  useEffect(() => {
    if (!wavesurfer) return;

    wavesurfer.on("play", () => {
      setIsPlaying(true);
      setFocusedItem(id);
    });
    wavesurfer.on("pause", () => {
      setIsPlaying(false);
      setFocusedItem(id);
			if(wavesurfer.getCurrentTime() === wavesurfer.getDuration()) {
				wavesurfer.seekTo(0);
			}
    });
    wavesurfer.on("seeking", () => {
      setFocusedItem(id);
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

  const SPACE_KEY = " ";
  useKeypress(
    SPACE_KEY,
    (e) => {
      if (!isFocused) return;

      wavesurfer?.playPause();
      e.preventDefault();
    },
    [isFocused]
  );

  return (
    <div
      className={clsx(
        "relative w-full rounded-lg overflow-hidden shadow-sm border border-gray-400  flex flex-col items-center ",
        isRecording ? "bg-red-200" : "bg-gray-200"
      )}
      style={{ height: ITEMBOX_HEIGHT }}
    >
      <Uploader
        onAudio={(blob) => {
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
            const prompetText = prompt("text", text || "");
            if (!prompetText) return;
            setText(prompetText);
            setIsDirty(true);
          }}
        >
          text
        </Button>

        {recording && (
          <Button
            onClick={() => {
              wavesurfer?.playPause();
            }}
          >
            {isPlaying ? "⏸️" : "▶️"}
          </Button>
        )}

        {(recording || text) && (
          <Button
            onClick={() => {
              wavesurfer?.stop();
              setRecording(null);
              setText(null);
              setIsDirty(true);
            }}
          >
            ✕
          </Button>
        )}

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
        {isDirty ? (
          <Button
            onClick={async () => {
              save();
            }}
          >
            Save{isLoadingSave && "..."}
          </Button>
        ) : (
          <>
            {recording && (
              <Button
                onClick={async () => {
                  // download recording.blobUrl
                  let filename = "recording.wav";

                  if (text && text.length > 0) {
                    let slug = text
                    slug = slug.slice(0, 30); // make sure it's not longer than the max length
                    filename = `${slug}.wav`;
                  }
									const blob = await fetch(recording.wavOrBlobUrl)
									.then(response => response.blob())
									let blobURL = window.URL.createObjectURL(blob);


                  const a = document.createElement("a");
                  a.href = blobURL;
                  a.download = filename;
                  a.click();
                }}
              >
                ↓
              </Button>
            )}
          </>
        )}
      </div>
      {recording && (
        <PlaybackBoat
          key={recording.wavOrBlobUrl}
          blobUrl={recording.wavOrBlobUrl}
          isRecording={recording.isRecording}
          onSetWavesurfer={setWavesurfer}
          onRegionUpdate={(region) => {
            setRegion(region);
            if (!region) {
              setLastRegion(null);
            } else {
              setLastRegion({
                region,
                blobUrl: recording.wavOrBlobUrl,
                isRecording: recording.isRecording,
              });
            }
          }}
        />
      )}
      {text && <Text text={text} hasRecording={!!recording} />}
    </div>
  );
};

import { useMutation } from "@tanstack/react-query";
const Text = ({
  text,
  hasRecording,
}: {
  text: string;
  hasRecording: boolean;
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0 right-0 top-0 left-0  p-2  font-serif flex justify-center ",
        hasRecording ? "pb-4 items-end " : "items-center",
        text.length > 50 ? "text-xs" : "text-sm"
      )}
    >
      {text}
    </div>
  );
};
import clsx from "clsx";
import useKeypress from "./utils/useKeyPress";
