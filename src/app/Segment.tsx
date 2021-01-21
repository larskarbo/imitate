
import React, { useContext, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { AiOutlineMergeCells, AiOutlinePlayCircle } from "react-icons/ai"
import RecordBoat from "./RecordBoat";
import PlaybackBoat from "./PlaybackBoat";
import expl from "./expl.svg";
import { IoGitMerge, IoLanguage } from "react-icons/io5";
import axios from 'axios';

// const segment = {
//     videoId: "oTKWwVrCrI8",
//     from: 800,
//     to: 4659,
//     text: "Est-ce que vous savez quelle est la question préférée des profs de français ?"
// }


// https://www.youtube.com/watch?v=t-LsjB45tOg

let timer
export default function SegmentLoader({ segmentId, state, newSegment }) {
    console.log('state: ', state);
    console.log('segmentId: ', segmentId);
    const [segment, setSegment] = useState(null);
    const divRef = useRef()

    useEffect(() => {
        axios.get("/.netlify/functions/db/getSegment/" + segmentId)
            .then(r => {
                console.log('r.data: ', r.data);
                setSegment(r.data.segment)
            })
    }, [segmentId])

    return (
        <div ref={divRef} className="w-full">
            {(segment && divRef) && <Segment segment={segment} width={divRef.current.getBoundingClientRect().width} newSegment={newSegment} />}
        </div>
    )
}

function Segment({ segment, width, newSegment }) {
    const [youtubeElement, setYoutubeElement] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const [playing, setPlaying] = useState(false);
    const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
    const player = youtubeElement?.target


    const onStateChange = ({ data }) => {

        if (data == 1) {
            // playing
            setPlaying(true)

            if (player.getCurrentTime() * 1000 < (segment.from - 1000)) {
                player.seekTo(segment.from / 1000)
            }
            const now = Math.round(player.getCurrentTime() * 1000)
            clearTimeout(timer)
            timer = setTimeout(() => {
                player.pauseVideo()
                setHasPlayedOnce(true)
            }, segment.to - now)
        } else if (data == 2) {
            // paused
            setPlaying(false)

        } else if (data == 5) {

            // setMetaInfo(playingNowVideo.item.id, {
            //   duration: youtubeElement.target.getDuration() * 1000,
            //   title: youtubeElement.target.getVideoData().title,
            // });
        }
    };

    const playSegment = () => {
        player.seekTo(segment.from / 1000)
        player.playVideo()
        player.seekTo(segment.from / 1000)
        // player.loadVideoById({
        //     videoId: segment.videoId,
        //     from: segment.from / 1000,
        //     to: segment.to / 1000
        // })

        // setTimeout(() => {
        // }, 3000)

    }

    useEffect(() => {
        if (player) {
            console.log('segment: ', segment);
            // playSegment()
        }
    }, [segment.id])

    return (
        <>
            <h2 className="text-center uppercase text-xs text-gray-700 font-bold mb-8">Step 1 - Listen</h2>

            <div className="relative bg-black">

                <div className={(playing ? "opacity-100" : "opacity-100")} style={{
                    // filter: playing ? "blur(0px)" : "blur(1px)",
                }}>
                    <YouTube
                        videoId={segment.videoId}
                        opts={{
                            height: "200",
                            width: "" + Math.min(width, 448),
                            playerVars: {
                                controls: 0,
                                modestbranding: 1,
                                autoplay: 0,
                                playsinline: 1
                            },
                        }}
                        onReady={setYoutubeElement}
                        onStateChange={onStateChange}
                    // onPlaybackRateChange={({ data }) => {
                    //   setPlaybackRate(data);
                    // }}
                    />
                </div>
                {!playing &&
                    <div className="pb-8 pt-8 absolute left-0 bottom-0 right-0 top-0 flex justify-center items-center">
                        <div>
                            <button
                                onClick={playSegment}
                                className="ml-4 rounded items-center shadow-lg
                        	          justify-center text-sm flex py-2 px-6 bg-green-500 hover:bg-green-600 font-medium text-white  transition duration-150"
                            >
                                <AiOutlinePlayCircle className="mr-2" /> Play segment
                        	                    <span className="opacity-50 ml-1"> ({(Math.round((segment.to - segment.from) / 100) / 10).toFixed(1)}s)</span>
                            </button>
                        </div>

                    </div>
                }
            </div>

            <div className="bg-white px-8 py-4 my-8 rounded border w-full">
                <div className={"text-lg  text-gray-900 font-medium " + (playing ? "text-black" : "text-gray-600")}>{segment.text}</div>
            </div>

            {false &&
                <button className="mb-8 " onClick={() => {
                    axios.post("/.netlify/functions/db/rate", { segmentId: segment.id })
                        .then(r => {
                            console.log('r.data: ', r.data);

                        })
                }}>Rate 👍</button>
            }

            {hasPlayedOnce &&
                <>
                    <h2 className="text-center uppercase text-xs text-gray-700 font-bold mb-8 mt-12">Step 2 - Record yourself</h2>

                    <RecordBoat onRecordFinish={(blobUrl) => {
                        // setRecordings([{ blobUrl }, ...recordings])
                        setRecordings([{ blobUrl }])
                    }} />
                    {recordings.map(recording => (
                        <PlaybackBoat key={recording.blobUrl} blobUrl={recording.blobUrl} />
                    ))}
                </>
            }


            {(recordings.length > 0) &&
                <>
                    <h2 className="text-center uppercase text-xs text-gray-700 font-bold mb-8 mt-12">Step 3 - Iterate</h2>
                    <div className="bg-white px-8 py-4 my-8 rounded border w-full">
                        <p>Now it's time for <strong>practice</strong>.</p>
                        <p className="my-2">Listen to the original and re-record yourself. Try to produce the <strong>excact same sounds</strong>.</p>
                        <img className="mx-auto my-4" src={expl} />
                        <p className="my-2">👂 Train your ears to recognize sounds.</p>
                        <p className="my-2">🗣 Train your voice to produce sounds.</p>
                    </div>
                    <p>When you are happy, continue with a new sentence:</p>
                    <button
                        onClick={newSegment}
                        className="mt-4 rounded items-center mx-auto justify-center text-sm flex py-3 px-6 bg-gray-white border-2  hover:bg-gray-100 border-gray-600 font-medium text-gray-900  transition duration-150"
                    >
                        Get new sentence 🇫🇷
                    </button>
                </>
            }


            <div className="pt-48">

            </div>
        </>
    );
}