
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { IoPlaySharp } from 'react-icons/io5';

// htt>s://www.youtube.com/watch?v=t-LsjB45tOg

export default function PlaybackBoat({  blobUrl }) {

    const [playing, setPlaying] = useState(false)
    const audioRef = useRef()

    useEffect(() => {
        if (audioRef) {
            audioRef.current.addEventListener('error', function (error) {
                console.log('errorlars: ', error);
            });
            try {
                // audioRef.current.play()
            } catch (e) {
                console["log"]("Auroplay failed.", e)
            }

        }
    }, [blobUrl, audioRef])

    return (

        <div className="flex w-full">
            <audio className="w-full" id="player" controls ref={audioRef}>
                <source type="audio/mp3" src={blobUrl}></source>
            </audio>
        </div>
    );
}
