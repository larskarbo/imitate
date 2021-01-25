
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

// https://www.youtube.com/watch?v=t-LsjB45tOg

let recordedChunks = []
export default function RecordBoat({ onRecordFinish, onRecordingChange }) {

    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [audioData, setAudioData] = useState(null)
    const [recording, setRecording] = useState(false)
    const zoomViewRef = useRef()
    const audioRef = useRef()

    useEffect(() => {

    }, [])

    const start = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream)

            recordedChunks = []
            mediaRecorder.addEventListener('dataavailable', function (e) {


                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }
            });

            mediaRecorder.start()

            setRecording(true)
            onRecordingChange(true)
            setMediaRecorder(mediaRecorder)
        })


    }

    const stop = () => {
        const onStop = () => {
            onRecordFinish(URL.createObjectURL(recordedChunks[0]))
            onRecordingChange(false)
            mediaRecorder.removeEventListener('stop', onStop);
        }
        mediaRecorder.addEventListener('stop', onStop);
        
        
        mediaRecorder.stream.getTracks() // get all tracks from the MediaStream
        .forEach(track => track.stop());
        mediaRecorder.stop()
        setRecording(false)
    }

    return (
        <div className="w-full flex-grow flex items-center justify-center">

            <button className={"w-16 h-16 rounded-full text-white font-bold shadow " + (recording ? "bg-gray-500" : "bg-red-500")} onClick={() => {
                if (recording) {
                    stop()
                } else {
                    start()
                }
            }}>{recording ? "stop" : "rec"}</button>
        </div>
    );
}
