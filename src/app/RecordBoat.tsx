
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Peaks from 'peaks.js';

// https://www.youtube.com/watch?v=t-LsjB45tOg

let recordedChunks = []
export default function RecordBoat({ onRecordFinish }) {

    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [audioData, setAudioData] = useState(null)
    const [recording, setRecording] = useState(false)
    const zoomViewRef = useRef()
    const audioRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            setMediaRecorder(new MediaRecorder(stream))
        })
    }, [])

    const start = () => {
        recordedChunks = []
        mediaRecorder.addEventListener('dataavailable', function (e) {


            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        });

        mediaRecorder.start()

        setRecording(true)

    }

    const stop = () => {
        const onStop = () => {
            onRecordFinish(URL.createObjectURL(recordedChunks[0]))
            mediaRecorder.removeEventListener('stop', onStop);
        }
        mediaRecorder.addEventListener('stop', onStop);

        mediaRecorder.stop()
        setRecording(false)
    }

    return (
        <div className="w-full h-24 flex items-center justify-center">

            <button className={"w-16 h-16 bg-red-500 rounded-full text-white font-bold shadow " + (recording && "animate-pulse")} onClick={() => {
                if (recording) {
                    stop()
                } else {
                    start()
                }
            }}>{recording ? "stop" : "rec"}</button>
        </div>
    );
}
