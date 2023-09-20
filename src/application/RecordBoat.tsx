import React, { useEffect, useState } from "react";
import { blobToAudioBuffer } from "./blobToAudioBuffer";

let recordedChunks: Blob[] = [];
export default function RecordBoat({
  onRecordFinish,
  onIsRecordingChange,
}: {
  onRecordFinish: ({
    blobUrl,
    chunks,
    sampleRate,
    blob,
    audioBuffer,
  }: {
    blob: Blob;
    audioBuffer: AudioBuffer;
    blobUrl: string;
    chunks: Blob[];
    sampleRate: number;
  }) => void;
  onIsRecordingChange: (isRecording: boolean) => void;
}) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const onStop = async () => {
      const blobOfAllBlobs = new Blob(recordedChunks, {
        type: mediaRecorder.mimeType,
      });
      const blobUrl = URL.createObjectURL(blobOfAllBlobs);

      const audioBuffer = await blobToAudioBuffer(blobOfAllBlobs);
      onRecordFinish({
        blobUrl,
        blob: blobOfAllBlobs,
        chunks: recordedChunks,
        audioBuffer,
        sampleRate: audioBuffer.sampleRate,
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
    <div className="w-full flex-grow flex items-center justify-center">
      <div className="flex flex-col items-center">
        {isLoadingLongTime ? (
          <button
            className={
              "w-16 h-16 rounded-full text-white font-bold shadow " +
              "bg-gray-500"
            }
          >
            loading...
          </button>
        ) : (
          <button
            className={
              "w-16 h-16 rounded-full text-white font-bold shadow " +
              (isRecording ? "bg-gray-500" : "bg-red-500")
            }
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
          </button>
        )}
        <div className="sm:hidden text-xs pt-2 text-gray-600 font-light">
          Recording might not work on mobile devices
        </div>
      </div>
    </div>
  );
}
