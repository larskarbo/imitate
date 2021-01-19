
import React, { useContext, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { AiOutlineMergeCells, AiOutlinePlayCircle } from "react-icons/ai"
import RecordBoat from "./RecordBoat";
import PlaybackBoat from "./PlaybackBoat";
import { IoGitMerge, IoLanguage } from "react-icons/io5";

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
    const [youtubeElement, setYoutubeElement] = useState(null);
    const [recordings, setRecordings] = useState([]);
    const player = youtubeElement?.target


    const onStateChange = ({ data }) => {

        if (data == 1) {
            // playing

            const now = Math.round(player.getCurrentTime() * 1000)
            setTimeout(() => {
                player.pauseVideo()
            }, segmentInfo.to - now)
        } else if (data == 2) {
            // paused


        } else if (data == 5) {


            // setMetaInfo(playingNowVideo.item.id, {
            //   duration: youtubeElement.target.getDuration() * 1000,
            //   title: youtubeElement.target.getVideoData().title,
            // });
        }
    };

    const playSegment = () => {


        player.seekTo(segmentInfo.from / 1000)
        player.playVideo()
    }

    return (
        <div className="pt-24 flex flex-col items-center">
            <h1 className="mb-8 text-xl font-bold">Press "play segment" to test</h1>
            <YouTube
                videoId={segmentInfo.videoId}
                opts={{
                    height: "200",
                    width: "400",
                    playerVars: {
                        controls: 0,
                        modestbranding: 1,
                        autoplay: 0,
                    },
                }}
                onReady={setYoutubeElement}
                onStateChange={onStateChange}
            // onPlaybackRateChange={({ data }) => {
            //   setPlaybackRate(data);
            // }}
            />

            <div className="text-lg  text-gray-900 pt-6">{segmentInfo.text}</div>

            <div className="pb-8 pt-8 flex justify-center">
                <button
                    onClick={playSegment}
                    className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-green-500 hover:bg-green-600 font-medium text-white  transition duration-150"
                >
                    <AiOutlinePlayCircle className="mr-2" /> Play segment
                    <span className="opacity-50 ml-1"> ({(Math.round((segmentInfo.to - segmentInfo.from) / 100) / 10).toFixed(1)}s)</span>
                </button>
                <button
                    onClick={() => { }}
                    className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-gray-500 hover:bg-gray-600 font-medium text-white  transition duration-150"
                >
                    {/* <IoLanguage className="mr-2" /> */}
                    New video
                </button>
            </div>

            <RecordBoat onRecordFinish={(blobUrl) => {
                setRecordings([{ blobUrl }, ...recordings])
            }} />
            {recordings.map(recording => (
                <PlaybackBoat key={recording.blobUrl} blobUrl={recording.blobUrl} />
            ))}

            <div className="pt-48">

            </div>
        </div>
    );
}