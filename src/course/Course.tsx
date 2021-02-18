import React, { useContext, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { AiOutlineMergeCells, AiOutlinePlayCircle } from "react-icons/ai";
import { IoGitMerge, IoLanguage } from "react-icons/io5";
import axios from "axios";
import { Router, Redirect } from "@reach/router";
import { navigate, Link } from "gatsby";
import { Header } from "../pages";
import content from "./content";
import SegmentPro from './SegmentPro';

export default function Main({ slug }) {
  console.log("slug: ", slug);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     if (!segmentId) {
  //       newSegment();
  //     }
  //   }, [segmentId]);

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

  const page = content.find((c) => c.slug == slug);
  const isSound = page.phonetic;

  console.log(
    "https://res.cloudinary.com/dfzqjzusj/video/upload/" +
      page.explainerVideo +
      ".mp4"
  );

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Link to="/app">
        <Header />
      </Link>
      <div className="pb-8"></div>
      <div className="w-full max-w-screen-lg flex">
        <div
          className={"w-40 flex-shrink-0 border-r font-light text-gray-700 pr-2"}
        >
          <ul>
            {content.map((c) => {
              const title = c.title ? (
                <span>{c.title}</span>
              ) : (
                <span>
                  <span className="font-mono ">[{c.phonetic}]</span> {c.word}
                </span>
              );
              const active = c.slug == page.slug;
              return (
                <Link to={"/french/pronunciation-course/" + c.slug}>
                  <li
                    className={
                      " flex items-center justify-between py-1 px-2 rounded transition-colors  " +
                      (active
                        ? "font-bold text-black bg-gray-200 hover:bg-gray-200"
                        : " hover:bg-gray-100")
                    }
                  >
                    {title}
                    <div className="rounded-full bg-gray-200 border-gray-600  border w-4 h-4"></div>
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
                  The{" "}
                  <span className="font-mono bg-gray-200 rounded-md font-bold">
                    [{page.phonetic}]
                  </span>{" "}
                  sound
                </span>{" "}
                like in {page.word}
              </h1>

              <h2 className="text-2xl font-semibold py-4">
                How to make this sound:
              </h2>

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
                        "https://res.cloudinary.com/dfzqjzusj/video/upload/v1613399890/" +
                        page.explainerVideo +
                        ".mp4"
                      }
                    />
                    Sorry, your browser doesn't support embedded videos.
                  </video>
                </>
              )}

              {page.exercises && (
                <>
                  <h2 className="text-2xl font-semibold py-4">Exercises:</h2>
                  {page.exercises.map(exercise => (
                    <SegmentPro segment={{
                      text: exercise.text,
                      videoHost: "cloudinary",
                      videoId: exercise.video
                    }} />
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
