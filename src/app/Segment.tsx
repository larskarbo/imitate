import React, { useContext, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { AiOutlineMergeCells, AiOutlinePlayCircle } from "react-icons/ai";
import RecordBoat from "./RecordBoat";
import PlaybackBoat from "./PlaybackBoat";
import { IoGitMerge, IoLanguage } from "react-icons/io5";
import axios from "axios";

// const segment = {
//     videoId: "B9rVdOLWsak",
//     from: 11*60000 + 28 * 1000 + 500,
//     to: 11*60000 + 28 * 1000 + 2200,
//     text: "Et une dernière chose avant de finir"
// }

// const segment = {
//     videoId: "B9rVdOLWsak",
//     from: 11 * 60000 + 28 * 1000 + 2200,
//     to: 11 * 60000 + 28 * 1000 + 6200,
//     text: "C'est normal d'avoir des jour avec et des jour sans"
// }

// https://www.youtube.com/watch?v=t-LsjB45tOg

let timer;
export default function SegmentLoader({ loading, segmentId, newSegment }) {

  const [loadingHere, setLoadingHere] = useState(false);

  const [segment, setSegment] = useState(null);

  useEffect(() => {
    setLoadingHere(true)
    axios.get("/.netlify/functions/db/getSegment/" + segmentId).then((r) => {
      setLoadingHere(false)
      setSegment(r.data.segment);
    });
  }, [segmentId]);

  return (
    <div className="w-full">
      {(loading || loadingHere) ?
      <div className="w-full h-16 animate-pulse bg-gray-100"></div>
    :
    
      <>
        {segment && (
          <Segment
            segment={segment}
            newSegment={newSegment}
          /> )}
      
      </> 
    }
    </div>
  );
}

function Segment({ segment, newSegment }) {
  const [youtubeElement, setYoutubeElement] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const player = youtubeElement?.target;

  const divRef = useRef();

  const [ytWidth, setYtWidth] = useState(448);
  useEffect(() => {
    setYtWidth(divRef.current?.getBoundingClientRect().width)
  }, [divRef.current?.getBoundingClientRect().width])

  const onStateChange = ({ data }) => {
    if (data == 1) {
      // playing
      setPlaying(true);

      if (player.getCurrentTime() * 1000 < segment.from - 1000) {
        player.seekTo(segment.from / 1000);
      }
      const now = Math.round(player.getCurrentTime() * 1000);
      clearTimeout(timer);
      timer = setTimeout(() => {
        player.pauseVideo();
        setHasPlayedOnce(true);
      }, segment.to - now);
    } else if (data == 2) {
      // paused
      setPlaying(false);
    } else if (data == 5) {
      // setMetaInfo(playingNowVideo.item.id, {
      //   duration: youtubeElement.target.getDuration() * 1000,
      //   title: youtubeElement.target.getVideoData().title,
      // });
    }
  };

  const playSegment = () => {
    player.seekTo(segment.from / 1000);
    player.playVideo();
    player.seekTo(segment.from / 1000);
    // player.loadVideoById({
    //     videoId: segment.videoId,
    //     from: segment.from / 1000,
    //     to: segment.to / 1000
    // })

    // setTimeout(() => {
    // }, 3000)
  };

  useEffect(() => {
    if (player) {

      // playSegment()
    }
  }, [segment.id]);

  return (
    <>
      {/* <h2 className="text-center uppercase text-xs text-gray-700 font-bold mb-8">Step 1 - Listen</h2> */}
      <button
        onClick={newSegment}
        className="rounded items-center mb-8 text-xs mx-auto justify-center flex py-2 px-4 bg-gray-50 border  hover:bg-blue-100 border-gray-400 hover:border-blue-600 font-medium text-gray-900  transition duration-150"
      >
        New sentence 🇫🇷
      </button>
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
          <h2 className="ext-left uppercase text-xs text-gray-700 font-bold mb-2">
            Pronunciation
          </h2>
          <div
            className="relative bg-black rounded overflow-hidden"
            style={{
              height: 200,
            }}
          >
            <div
              ref={divRef}
              className={playing ? "opacity-100" : "opacity-30"}
              style={
                {
                  // filter: playing ? "blur(0px)" : "blur(1px)",
                }
              }
            >
              <YouTube
                videoId={segment.videoId}
                opts={{
                  height: "200",
                  width: ytWidth,
                  playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    autoplay: 0,
                    playsinline: 1,
                  },
                }}
                onReady={setYoutubeElement}
                onStateChange={onStateChange}
              // onPlaybackRateChange={({ data }) => {
              //   setPlaybackRate(data);
              // }}
              />
            </div>
            {!playing && (
              <div className="pb-8 pt-8 absolute left-0 bottom-0 right-0 top-0 flex justify-center items-center">
                <div>
                  <button
                    onClick={playSegment}
                    className="ml-4 rounded items-center shadow-lg
                                	          justify-center text-sm flex py-2 px-6 bg-green-500 hover:bg-green-600 font-medium text-white  transition duration-150"
                  >
                    <AiOutlinePlayCircle className="mr-2" /> Listen
                    <span className="opacity-50 ml-1">
                      {" "}
                      (
                      {(
                        Math.round((segment.to - segment.from) / 100) / 10
                      ).toFixed(1)}
                      s)
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sm:w-1/2 sm:pl-4 mb-8">
          <h2 className="text-left uppercase text-xs text-gray-700 font-bold mb-2">
            Practice chamber
          </h2>
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


      {false && (
        <button
          className="mb-8 "
          onClick={() => {
            axios
              .post("/.netlify/functions/db/rate", { segmentId: segment.id })
              .then((r) => {

              });
          }}
        >
          Rate 👍
        </button>
      )}

    </>
  );
}
