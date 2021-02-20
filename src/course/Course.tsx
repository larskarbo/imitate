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
import tutorial from "./tutorial.png";

import ReactMarkdown from "react-markdown";

export default function CourseWrapper(props) {
  return (
    <ProgressProvider>
      <Course {...props} />
    </ProgressProvider>
  );
}

function Course({ slug }) {
  const page = content.find((c) => c.slug == slug);
  const isSound = page.phonetic;

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Header />

      <div className="pb-8"></div>
      <div className="w-full max-w-screen-lg flex">
        <div className={"w-40 flex-shrink-0 border-r font-light text-gray-700 pr-2"}>
          <ul>
            {content.map((c) => (
              <SidebarElement content={c} active={c.slug == page.slug} />
            ))}
          </ul>
        </div>
        <main className="pl-12">
          {!isSound && (
            <>
              <h1 className="text-4xl pt-4 font-bold pb-8">{page.title}</h1>
              {page.slug == "using-imitate" && (
                <article>
                  <p>Each sound you learn follows this structure:</p>
                  <ol>
                    <li>
                      <strong>Learn the theory</strong>
                    </li>
                    <li>
                      <strong>Learn the spelling rules</strong>
                    </li>
                    <li>
                      Small sound <strong>exercises</strong>.
                    </li>
                  </ol>
                  <p>The exercises have example phrases. Your job is to imitate them.</p>
                  <img src={tutorial} className="max-w-lg border rounded-lg p-4 shadow-lg" />
                  <p>By practicing like this you will learn two things:</p>
                  <p>👂 Train your ears to recognize sounds.</p>
                  <p>🗣 Train your voice to produce sounds.</p>
                  <p>
                    Remember to <strong>practice consistently</strong>, and you will achieve great results.
                  </p>
                  <h2>Technical problems</h2>
                  <p>The recording functionality might not work in all browsers.</p>
                  <p>
                    👺 <strong>Problematic</strong>: iPhone, iPad, Safari.
                  </p>
                  <p>
                    ✅ <strong>Best</strong>: Google Chrome or Firefox on a desktop or laptop computer.
                  </p>
                  <p>
                    I am working on making this work everywhere! In the meantime, try to use the devices and browsers
                    that work.
                  </p>
                </article>
              )}

              <SelfAssessment id={page.slug} type={"article"} />
              <NextChapter id={page.slug} />
            </>
          )}
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

              {page.spellingRules && (
                <div className="py-16">
                  <h2 className="text-2xl font-semibold py-4">Spelling rules:</h2>
                  <ul className="list-disc pl-8 font-mono">
                    {page.spellingRules.map((spelling) => (
                      <li className="pt-2">
                        <ReactMarkdown>{spelling}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
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
                      <SelfAssessment id={page.slug + "/" + exercise.id} />
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

const SidebarElement = ({ content: contentElement, active }) => {
  const { getProgress } = useProgress();
  const progress = getProgress(contentElement.slug);
  const title = contentElement.title ? (
    <span>{contentElement.title}</span>
  ) : (
    <span>
      <span className="font-mono ">[{contentElement.phonetic}]</span> {contentElement.word}
    </span>
  );
  return (
    <Link key={contentElement.slug} to={"/french/pronunciation-course/" + contentElement.slug}>
      <li
        className={
          " flex items-center justify-between py-1 px-2 rounded transition-colors  " +
          (active ? "font-bold text-black bg-gray-200 hover:bg-gray-200" : " hover:bg-gray-100")
        }
      >
        {title}
        {progress == 0 && <div className="rounded-full bg-gray-200 border-gray-600  border w-4 h-4"></div>}
        {progress > 0 && progress <= 40 && (
          <div className="rounded-full bg-yellow-200 border-gray-600  border w-4 h-4"></div>
        )}
        {progress > 40 && progress < 100 && (
          <div className="rounded-full bg-yellow-400 border-gray-600  border w-4 h-4"></div>
        )}
        {progress == 100 && <div className="rounded-full bg-green-300 border-gray-600  border w-4 h-4"></div>}
      </li>
    </Link>
  );
};

const NextChapter = ({ id }: { id: string }) => {
  const { progress, getProgress, setProgress } = useProgress();
  const progressHere = getProgress(id);

  const ourIndex = content.findIndex((c) => c.slug == id);

  return (
    progressHere > 0 && (
      <button
        className={`mt-8 flex font-light items-center border border-gray-400 rounded p-2 px-4
    hover:border-gray-600 transition-colors duration-150 hover:shadow-sm`}
        onClick={() => {
          navigate("/french/pronunciation-course/" + content[ourIndex + 1].slug);
        }}
      >
        Go to the next chapter →
      </button>
    )
  );
};

const SelfAssessment = ({ id, type = "sound" }: { id: string; type?: "sound" | "article" }) => {
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
          <div className="mr-2 text-sm text-gray-800 font-light">
            {type == "sound" ? "Just starting." : "Need to come back."}
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setProgress(id, 40)}
            className="w-12 h-12 rounded mr-2 border border-gray-400 flex justify-center items-center bg-yellow-200"
          >
            {progressHere == 40 && <FaCheck size={24} className="text-yellow-700" />}
          </button>
          <div className="mr-2 text-sm text-gray-800 font-light">
            {type == "sound" ? "Almost there." : "Almost there."}
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              if (progressHere != 100) {
                setProgress(id, 100, celebrate);
              }
            }}
            className="w-12 h-12 rounded mr-2 border border-gray-400 flex justify-center items-center bg-green-300"
          >
            {progressHere == 100 && <FaCheck size={24} className="text-white" />}
          </button>
          <div className="mr-2 text-sm text-gray-800 font-light">
            {type == "sound" ? "Perfect." : "Read/watched and understood."}
          </div>
        </div>
      </div>
    </div>
  );
};
