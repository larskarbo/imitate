
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { IoPlaySharp } from 'react-icons/io5';

// htt>s://www.youtube.com/watch?v=t-LsjB45tOg

export default function PlaybackBoat({ blobUrl }) {

    const [playing, setPlaying] = useState(false)
    const audioRef = useRef()

    useEffect(() => {
        if (audioRef) {

            audioRef.current.play()
        }
    }, [blobUrl, audioRef])

    return (

        <div className="flex w-full">
            <audio className="w-full" src={blobUrl} id="player" controls ref={audioRef}></audio>
        </div>
    );
}
