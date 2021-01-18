
import React, { useContext, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { AiOutlinePlayCircle } from "react-icons/ai"

const segmentInfo = {
    videoId: "oTKWwVrCrI8",
    from: 800,
    to: 4659,
    text: "Est-ce que vous savez quelle est la question préférée des profs de français ?"
}

export default function Main({ segmentId }) {
    const [youtubeElement, setYoutubeElement] = useState(null);
    const [playing, setPlaying] = useState(false);
    const player = youtubeElement?.target
    console.log('segmentId: ', segmentId);

    const onStateChange = ({ data }) => {

        if (data == 1) {
            // playing
            console.log()
            const now = Math.round(player.getCurrentTime() * 1000)
            setTimeout(() => {
                player.pauseVideo()
            }, segmentInfo.to - now)
        } else if (data == 2) {
            // paused
            console.log(Math.round(player.getCurrentTime() * 1000))

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

            <div className="pb-12 pt-8 flex justify-center">
                <button
                    onClick={playSegment}
                    className="ml-4 rounded items-center
          justify-center text-sm flex py-2 px-6 bg-green-500 hover:bg-green-600 font-medium text-white  transition duration-150"
                >
                    <AiOutlinePlayCircle className="mr-2" /> Play segment
                    <span className="opacity-50 ml-1"> ({(Math.round((segmentInfo.to - segmentInfo.from) / 100)/10).toFixed(1)}s)</span>
            </button>
            </div>
        </div>
    );
}