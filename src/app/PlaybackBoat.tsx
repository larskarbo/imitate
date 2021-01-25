
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Peaks from 'peaks.js';
import { IoPlaySharp } from 'react-icons/io5';

// htt>s://www.youtube.com/watch?v=t-LsjB45tOg

export default function PlaybackBoat({ blobUrl }) {

    const [playing, setPlaying] = useState(false)
    const [peaks, setPeaks] = useState(null)
    const zoomViewRef = useRef()
    const audioRef = useRef()

    useEffect(() => {
        if (audioRef && zoomViewRef) {

            blobToAudioBuffer(blobUrl)
                .then(audiobuffer => {
                    const info = getAudioBufferInfo(audiobuffer)


                    const options = {
                        containers: {
                            overview: false,
                            zoomview: zoomViewRef.current
                        },
                        mediaElement: audioRef.current,
                        webAudio: {
                            audioBuffer: audiobuffer
                        },
                        zoomLevels: [20, 512, 1024, 2048, 4096],
                        segments: [{
                            startTime: info.soundStart,
                            endTime: info.soundEnd,
                            editable: true,
                            color: "rgba(85, 85, 85, 1)",
                            labelText: "Export Segment"
                        }],
                        zoomWaveformColor: "#282828"
                    };

                    // Peaks.init(options, (err, peaks) => {
                    //     // Do something when the waveform is displayed and ready
                    //     // this.peaks = peaks
                    //     setPeaks(peaks)
                    //     const view = peaks.views.getView('zoomview');
                    //     peaks.player.playSegment(peaks.segments.getSegments()[0]);
                    //     view.setZoom({ seconds: info.duration + 0.1 });
                    // });
                })

        }
    }, [blobUrl, audioRef, zoomViewRef])

    const play = () => {
        peaks.player.playSegment(peaks.segments.getSegments()[0]);
    }

    return (

        <div className="flex w-full">
            <audio  src={blobUrl} id="player" controls ref={audioRef}></audio>
            {/* <div className="w-16 h-16 flex items-center justify-center">

                <button className="w-10 h-10 bg-gray-400 rounded-full text-white font-bold shadow flex items-center justify-center" onClick={() => {
                    if (playing) {

                    } else {
                        play()
                    }
                }}><IoPlaySharp size={20} className="ml-1" /></button>
            </div>
            <div ref={zoomViewRef} className={"flex-grow h-16 " + "bg-gray-200"} /> */}
        </div>
    );
}

const blobToAudioBuffer = async (blobUrl) => {
    const blob = await fetch(blobUrl).then(r => r.blob());
    var AudioContext = window.AudioContext // Default
        || (window as any).webkitAudioContext;// Safari and old versions of Chrome
    const audioContext = new AudioContext()
    const fileReader = new FileReader()

    const audiobuffer = await new Promise(resolve => {
        // Set up file reader on loaded end event
        fileReader.onloadend = () => {

            const arrayBuffer = fileReader.result

            // Convert array buffer into audio buffer
            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {





                resolve(audioBuffer)
            })

        }

        //Load blob
        fileReader.readAsArrayBuffer(blob)

    })
    return audiobuffer


}

const getAudioBufferInfo = (audioBuffer) => {
    const TRESHOLD = 0.04
    // Do something with audioBuffer
    const erp = audioBuffer.getChannelData(0)
    let startOffset = erp.findIndex(a => a > TRESHOLD) - 1500

    if (startOffset < 0) {
        startOffset = 0
    }
    let endOffset = erp.length
    // let endOffset = erp.length - ([...erp].reverse().findIndex(a => a > TRESHOLD) - 1500)
    // if (endOffset < 0) {
    //     endOffset = 0
    // }


    return {
        soundStart: startOffset / audioBuffer.sampleRate,
        soundEnd: endOffset / audioBuffer.sampleRate,
        duration: audioBuffer.duration
    }



}