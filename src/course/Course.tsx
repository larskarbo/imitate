import React, { useContext, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { AiOutlineMergeCells, AiOutlinePlayCircle } from "react-icons/ai";
import { IoGitMerge, IoLanguage } from "react-icons/io5";
import axios from "axios";
import { Router, Redirect } from "@reach/router";
import { navigate, Link } from "gatsby";
import content from "./content";
import SegmentPro from "./SegmentPro";
import { Header } from "./Header";
import { FaCheck } from "react-icons/fa";
import { celebrate } from "./celebrate";
import { ProgressProvider, useProgress } from "./progress-context";

export default function CourseWrapper(props) {
  return (
    <ProgressProvider>
      <Course {...props} />
    </ProgressProvider>
  );
}

function Course({ slug }) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { progress } = useProgress();

  const newSegment = () => {
    setLoading(true);
    axios.get("/.netlify/functions/db/random").then((r) => {
      setTotal(r.data.total);
      setLoading(false);
      console.log("r.data.total: ", r.data.total);

      navigate("/app/" + r.data.segment.id, {
        state: { segment: r.data.segment },
      });
    });
  };

  const chapters = content.map((p) => {
    let progressTotal = 0;
    console.log("p: ", p);
    p?.exercises?.forEach((e) => {
      console.log("progress: ", progress);
      if (progress?.[e.id]) {
        progressTotal += progress[e.id];
      }
    });

    return {
      ...p,
      progress: p?.exercises && progressTotal > 0 ? progressTotal / p?.exercises.length : 0,
    };
  });

  const page = chapters.find((c) => c.slug == slug);
  const isSound = page.phonetic;

  console.log("https://res.cloudinary.com/dfzqjzusj/video/upload/" + page.explainerVideo + ".mp4");

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Header />

      <div className="pb-8"></div>
      <div className="w-full max-w-screen-lg flex">
        <div className={"w-40 flex-shrink-0 border-r font-light text-gray-700 pr-2"}>
          <ul>
            {chapters.map((c) => {
              const title = c.title ? (
                <span>{c.title}</span>
              ) : (
                <span>
                  <span className="font-mono ">[{c.phonetic}]</span> {c.word}
                </span>
              );
              const active = c.slug == page.slug;
              return (
                <Link key={c.slug} to={"/french/pronunciation-course/" + c.slug}>
                  <li
                    className={
                      " flex items-center justify-between py-1 px-2 rounded transition-colors  " +
                      (active ? "font-bold text-black bg-gray-200 hover:bg-gray-200" : " hover:bg-gray-100")
                    }
                  >
                    {title}
                    {c.progress == 0 && (
                      <div className="rounded-full bg-gray-200 border-gray-600  border w-4 h-4"></div>
                    )}
                    {c.progress > 0 && c.progress <= 40 && (
                      <div className="rounded-full bg-yellow-200 border-gray-600  border w-4 h-4"></div>
                    )}
                    {c.progress > 40 && c.progress < 100 && (
                      <div className="rounded-full bg-yellow-400 border-gray-600  border w-4 h-4"></div>
                    )}
                    {c.progress == 100 && (
                      <div className="rounded-full bg-green-300 border-gray-600  border w-4 h-4"></div>
                    )}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        <main className="pl-12">
          {isSound && (
            <>
              <h1 className="text-4xl pt-4 font-light pb-8">
                <span className="font-bold">
                  The <span className="font-mono bg-gray-200 rounded-md font-bold">[{page.phonetic}]</span> sound
                </span>{" "}
                like in {page.word}
              </h1>

              <h2 className="text-2xl font-semibold py-4">How to make this sound:</h2>

              {page.explainerVideo && (
                <>
                  <video
                    className="w-full max-w-xl"
                    controls={true}
                    // muted
                    // loop
                    // autoPlay
                  >
                    <source
                      src={
                        "https://res.cloudinary.com/dfzqjzusj/video/upload/v1613399890/" + page.explainerVideo + ".mp4"
                      }
                    />
                    Sorry, your browser doesn't support embedded videos.
                  </video>
                </>
              )}

              {page.exercises && (
                <>
                  <h2 className="text-2xl font-semibold py-4">Exercises:</h2>
                  {page.exercises.map((exercise) => (
                    <div key={exercise.id}>
                      <SegmentPro
                        segment={{
                          text: exercise.text,
                          videoHost: "cloudinary",
                          videoId: "fpb/" + exercise.id,
                        }}
                      />
                      <SelfAssessment id={exercise.id} />
                      <div className="py-32">
                        <hr />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const SelfAssessment = ({ id }) => {
  const { progress, getProgress, setProgress } = useProgress();
  const progressHere = getProgress(id);

  return (
    <div>
      <div className="smallcase pb-2">Self assessment:</div>
      <div className="flex">
        <div className="flex items-center">
          <button
            onClick={() => setProgress(id, 20)}
            className="w-12 h-12 rounded mr-2 border border-gray-400 flex justify-center items-center bg-yellow-100"
          >
            {progressHere == 20 && <FaCheck size={24} className="text-yellow-700" />}
          </button>
          <div className="mr-2 text-sm text-gray-800 font-light">Just starting.</div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setProgress(id, 40)}
            className="w-12 h-12 rounded mr-2 border border-gray-400 flex justify-center items-center bg-yellow-200"
          >
            {progressHere == 40 && <FaCheck size={24} className="text-yellow-700" />}
          </button>
          <div className="mr-2 text-sm text-gray-800 font-light">Almost there.</div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              if(progressHere!=100){
                setProgress(id, 100, celebrate);
              }
            }}
            className="w-12 h-12 rounded mr-2 border border-gray-400 flex justify-center items-center bg-green-300"
          >
            {progressHere == 100 && <FaCheck size={24} className="text-white" />}
          </button>
          <div className="mr-2 text-sm text-gray-800 font-light">Perfect.</div>
        </div>
      </div>
    </div>
  );
};
