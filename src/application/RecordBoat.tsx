import React, { useEffect, useState } from "react";
import { blobToAudioBuffer } from "./blobToAudioBuffer";
import { audioBufferToBlob } from "./audioBufferToBlob";
import { trimSilence } from "./trimSilence";
import { useAtom } from "jotai";
import { recordingCountAtom } from "./Chamber";

let recordedChunks: Blob[] = [];
export default function RecordBoat({
  onRecordFinish,
  onIsRecordingChange,
}: {
  onRecordFinish: ({
    blobUrl,
    chunks,
    blob,
  }: {
    blob: Blob;
    blobUrl: string;
    chunks: Blob[];
  }) => void;
  onIsRecordingChange: (isRecording: boolean) => void;
}) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordCount, setRecordCount] = useAtom(recordingCountAtom);

  const [isLoadingLongTime, setIsLoadingLongTime] = useState(false);

  // Assume your setLoading is updated in some other part of your code

  useEffect(() => {
    let timer;

    if (loading) {
      timer = setTimeout(() => {
        setIsLoadingLongTime(true);
      }, 1000);
    } else {
      setIsLoadingLongTime(false);
    }

    // Cleanup function to clear our timeout when loading changes
    return () => clearTimeout(timer);
  }, [loading]);

  const start = () => {
    setLoading(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        setLoading(false);

        // @ts-ignore
        const mediaRecorder = new window.MediaRecorder(stream);

        recordedChunks = [];
        mediaRecorder.addEventListener("dataavailable", function (e) {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });

        mediaRecorder.start();

        setIsRecording(true);
        onIsRecordingChange(true);
        setMediaRecorder(mediaRecorder);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const stop = () => {
    if (!mediaRecorder) return;
    setLoading(true);
    setRecordCount(recordCount + 1);
    const onStop = async () => {
      const blobOfAllBlobs = new Blob(recordedChunks, {
        type: mediaRecorder.mimeType,
      });

      const audioBuffer = await blobToAudioBuffer(blobOfAllBlobs);
      const audioBufferCleaned = await trimSilence(audioBuffer);

      const newBlob = await audioBufferToBlob(audioBufferCleaned);

      const blobUrl = URL.createObjectURL(newBlob);

      onRecordFinish({
        blobUrl,
        blob: newBlob,
        chunks: recordedChunks,
      });
      onIsRecordingChange(false);
      setLoading(false);
      mediaRecorder.removeEventListener("stop", onStop);
    };
    mediaRecorder.addEventListener("stop", onStop);

    mediaRecorder.stream
      .getTracks() // get all tracks from the MediaStream
      .forEach((track) => track.stop());
    mediaRecorder.stop();
    setIsRecording(false);
  };

  return (
    <>
      {isLoadingLongTime ? (
        <Button className={"    " + "bg-gray-500"}>loading...</Button>
      ) : (
        <Button
          className={"    " + (isRecording ? "bg-gray-500" : "bg-red-500")}
          disabled={loading}
          onClick={() => {
            if (isRecording) {
              stop();
            } else {
              start();
            }
          }}
        >
          {isRecording ? "stop" : "rec"}
        </Button>
      )}
    </>
  );
}

export const Button = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      {...props}
      className={
        "px-2 py-1 text-white font-bold shadow bg-gray-500 text-xs " +
        "whitespace-nowrap" +
        props.className
      }
    >
      {props.children}
    </button>
  );
};
