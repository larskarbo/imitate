import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlayCircle } from "react-icons/ai";
import PlaybackBoat from "../app/PlaybackBoat";
import RecordBoat from "../app/RecordBoat";
import { axios } from "axios";

export default function SegmentPro({ segment }) {
  
  const [recordings, setRecordings] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [recording, setRecording] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const playerRef = useRef();

  useEffect(() => {
    if (playerRef?.current) {
      setDuration(playerRef.duration);
    }
  }, [playerRef?.current]);

  // const onStateChange = ({ data }) => {
  //   
  //   if (data == 1) {
  //     // playing
  //     setPlaying(true);

  //     if (player.getCurrentTime() * 1000 < segment.from - 1000) {
  //       player.seekTo(segment.from / 1000);
  //     }
  //     const now = Math.round(player.getCurrentTime() * 1000);
  //     clearTimeout(timer);
  //     const timeMultiplier = 1 / player.getPlaybackRate();
  //     timer = setTimeout(() => {
  //       player.pauseVideo();
  //       setHasPlayedOnce(true);
  //     }, timeMultiplier * (segment.to - now));
  //   } else if (data == 2) {
  //     // paused
  //     setPlaying(false);
  //   } else if (data == 5) {
  //     // setMetaInfo(playingNowVideo.item.id, {
  //     //   duration: youtubeElement.target.getDuration() * 1000,
  //     //   title: youtubeElement.target.getVideoData().title,
  //     // });
  //   }
  // };

  const playSegmentSlow = () => {
    playerRef.current.defaultPlaybackRate = 0.75;
    playSegment();
  };

  const playSegmentNormalSpeed = () => {
    playSegment();
  };

  const playSegment = () => {
    // player.currentTime = (segment.from / 1000);
    playerRef.current.play();
    // player.seekTo(segment.from / 1000);
  };

  return (
    <>
      {/* <h2 className="text-center uppercase text-xs text-gray-700 font-bold mb-8">Step 1 - Listen</h2> */}
      <div className="bg-white px-8 py-4 mb-8 rounded border w-full">
        <div
          className={
            "text-lg  text-gray-900 font-medium " +
            (playing ? "text-black" : "text-gray-600")
          }
        >
          {segment.text}
        </div>
      </div>

      <div className="flex w-full flex-col sm:flex-row">
        <div className="sm:w-1/2 sm:pr-4 mb-8">
          <div className="flex justify-between items-end h-6">
            <h2 className="ext-left uppercase text-xs text-gray-700 font-bold mb-2">
              Pronunciation
            </h2>
          </div>
          <div
            className="relative bg-black rounded overflow-hidden"
            style={{
              height: 200,
            }}
          >
            <div
              // ref={divRef}
              className={playing ? "opacity-100" : "opacity-100"}
              style={
                {
                  // filter: playing ? "blur(0px)" : "blur(1px)",
                }
              }
            >
              <video
                className="w-full"
                controls={false}
                ref={playerRef}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={t => {
                  

                }}
                // muted
                // loop
                // autoPlay
              >
                <source
                  src={
                    "https://res.cloudinary.com/dfzqjzusj/video/upload/" +
                    segment.videoId +
                    ".mp4"
                  }
                />
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
            {!playing && (
              <div className="pb-8 pt-8 absolute left-0 bottom-0 right-0 top-0 flex justify-center items-end">
                <div className="flex flex-col items-end">
                  <button
                    onClick={playSegmentNormalSpeed}
                    className="mb-4 ml-4 rounded items-center shadow-lg
                                	          justify-center text-sm flex py-2 px-6 bg-green-500 hover:bg-green-600 font-medium text-white  transition duration-150"
                  >
                    <AiOutlinePlayCircle className="mr-2" /> Listen
                    {/* <span className="opacity-50 ml-1">
                      {" "}
                      (
                      {(
                        Math.round((segment.to - segment.from) / 100) / 10
                      ).toFixed(1)}
                      s)
                    </span> */}
                  </button>
                  {/* <button
                      onClick={playSegmentSlow}
                      className="ml-4 rounded items-center shadow-lg
                                	          justify-center text-sm flex py-2 px-6 bg-gray-500 hover:bg-gray-600 font-medium text-white  transition duration-150"
                    >
                      <AiOutlinePlayCircle className="mr-2" /> Listen slow
                    </button> */}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sm:w-1/2 sm:pl-4 mb-8">
          <div className="flex justify-between items-end h-6">
            <h2 className="text-left uppercase text-xs text-gray-700 font-bold mb-2">
              Practice chamber
            </h2>
          </div>
          <div
            className={
              "rounded border flex flex-col justify-between " +
              (recording ? "bg-red-100 animate-pulse" : "bg-blue-50")
            }
            style={{
              height: 200,
            }}
          >
            <RecordBoat
              onRecordFinish={(blobUrl) => {
                // setRecordings([{ blobUrl }, ...recordings])
                setRecordings([{ blobUrl }]);
              }}
              onRecordingChange={setRecording}
            />
            {!recording && (
              <div className="h-16 border-t bg-gray-50">
                {recordings.map((recording) => (
                  <PlaybackBoat
                    key={recording.blobUrl}
                    blobUrl={recording.blobUrl}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
