
import React, { useContext, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { AiOutlineMergeCells, AiOutlinePlayCircle } from "react-icons/ai"
import RecordBoat from "./RecordBoat";
import PlaybackBoat from "./PlaybackBoat";
import { IoGitMerge, IoLanguage } from "react-icons/io5";
import Segment from "./Segment";
import axios from "axios"
import { Router, Redirect } from "@reach/router"
import { navigate } from 'gatsby';

// const segmentInfo = {
//     videoId: "oTKWwVrCrI8",
//     from: 800,
//     to: 4659,
//     text: "Est-ce que vous savez quelle est la question préférée des profs de français ?"
// }

const segmentInfo = {
    videoId: "t-LsjB45tOg",
    from: 474080,
    to: 474080 + 5640,
    text: 'Donc on prend un verbe anglais et on va le franciser en mettant une terminaison française.'
}

// https://www.youtube.com/watch?v=t-LsjB45tOg

export default function Main({ segmentId }) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!segmentId) {
            newSegment()
        }
    }, [segmentId])

    const newSegment = () => {
        axios.get("/.netlify/functions/db/random")
            .then(r => {
                console.log('r.data: ', r.data);
                setTotal(r.data.total)

                navigate("/app/" + r.data.segment.id, { state: { segment: r.data.segment } })
            })
    }

    return (
        <div className="pt-8 flex flex-col items-center px-8 w-full">
            <div className="text-xs mb-4">
                {/* Total: ({total}) */}
            </div>
            <button
                onClick={newSegment}
                className="ml-4 rounded items-center mb-16 
          justify-center text-sm flex py-3 px-6 bg-gray-white border-2  hover:bg-gray-100 border-gray-600 font-medium text-gray-900  transition duration-150"
            >
                {/* <IoLanguage className="mr-2" /> */}
                    Random french sentence 🇫🇷
                </button>

            {segmentId &&
                <Segment segmentId={segmentId} newSegment={newSegment} />
            }
        </div>
    );
}