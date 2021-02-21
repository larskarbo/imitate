import React, { useEffect } from "react";
import { navigate, Link } from "gatsby";
import content from "./content.json";
import SegmentPro from "./SegmentPro";
import { Header } from "./Header";
import { FaCheck } from "react-icons/fa";
import { celebrate } from "./celebrate";
import { ProgressProvider, useProgress } from "./progress-context";
import tutorial from "./tutorial.png";

import urlParser from "js-video-url-parser/lib/base";
import "js-video-url-parser/lib/provider/vimeo";
import { VimeoParseResult } from "js-video-url-parser/lib/provider/vimeo";
import ReactMarkdown from "react-markdown";
import { Redirect } from "@reach/router";
import { BASEPATH } from "../pages/french/pronunciation-course";

export default function CourseWrapper(props) {
  return (
    <ProgressProvider>
      <Course {...props} />
    </ProgressProvider>
  );
}

function Course({ slug, subslug }) {
  console.log("subslug: ", subslug);
  console.log("slug: ", slug);
  if (!slug) {
    // return <Redirect to="/french/pronunciation-course/intro" />
  }

  const overPage = content.find((c) => c.slug == slug);
  console.log("overPage: ", overPage);

  let page;
  let path;
  if (subslug) {
    page = overPage.children.find((c) => c.slug == subslug);
    path = slug + "/" + subslug;
  } else {
    page = overPage;
    path = slug;
  }

  if (page.type == "collection" && !subslug) {
    return <Redirect to={"/french/pronunciation-course/" + slug + "/" + page.children[0].slug} />;
  }

  const video = page.video && (urlParser.parse(page.video) as VimeoParseResult);

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Header />

      <div className="pb-8"></div>
      <div className="w-full max-w-screen-lg flex">
        <div className={"w-40 flex-shrink-0 border-r font-light text-gray-700 pr-2"}>
          <ul>
            {content.map((c) => (
              <SidebarElement key={c.slug} content={c} active={c.slug == overPage.slug} />
            ))}
          </ul>
        </div>
        <main className="pl-12">
          {subslug && (
            <>
              <h1 className="text-4xl pt-4 font-light pb-8">
                <span className="font-bold">
                  The <span className="font-mono bg-gray-200 rounded-md font-bold">[{overPage.phonetic}]</span> sound
                </span>{" "}
                like in {overPage.word}
              </h1>

              <div className="flex">
                {overPage.children.map((child, i) => (
                  <SmallNavElement
                    index={i}
                    parent={overPage}
                    element={child}
                    key={child.slug}
                    active={subslug == child.slug}
                  />
                ))}
              </div>
              <div className="pb-8"></div>
            </>
          )}
          {page.type == "article" && (
            <>
              {page.title && <h1 className="text-4xl pt-4 font-bold pb-8">{page.title}</h1>}
              {page.video && !subslug && <Vimeo id={video.id} />}
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

              {subslug == "intro" && (
                <>
                  <h2 className="text-2xl font-semibold py-4">How to make this sound:</h2>
                  {video && <Vimeo id={video.id} />}
                  {page.spellingRules && (
                    <div className="pt-8">
                      <h2 className="text-2xl font-semibold pb-4">Spelling rules:</h2>
                      <ul className="list-disc pl-8 font-mono">
                        {page.spellingRules.map((spelling) => (
                          <li className="pt-2">
                            <ReactMarkdown>{spelling}</ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              <div className="pb-8"></div>
              <SelfAssessment id={path} type={"article"} />
              <NextChapter slug={slug} subslug={subslug} path={path} />
            </>
          )}
          {page.type == "exercise" && (
            <>
              <SegmentPro
                segment={{
                  text: page.text,
                  videoHost: "cloudinary",
                  videoId: "fpb/" + page.slug,
                }}
              />

              <SelfAssessment id={path} />

              <NextChapter slug={slug} subslug={subslug} path={path} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const SmallNavElement = ({ parent, element, active, index }) => {
  const { getProgress } = useProgress();
  const progress = getProgress(parent.slug + "/" + element.slug);
  const link = BASEPATH + "/" + parent.slug + "/" + element.slug;

  return (
    <Link to={link}>
      <button className={`h-8 w-8 flex items-center justify-center mr-2 border ${active && "border-gray-800"} ${progress >1 && progressToColor(progress)} bg-opacity-50 rounded ` + (active ? "font-bold" : "")}>{index + 1}</button>
    </Link>
  );
};

const progressToColor = (progress) => {
  if(progress == 0){
    return "bg-gray-200"
  }
  if(progress < 40){
    return "bg-yellow-200"
  }
  if(progress < 100){
    return "bg-yellow-400"
  }
  return "bg-green-300"
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
  let link = BASEPATH + "/" + contentElement.slug;
  if (contentElement.type == "collection") {
    link = BASEPATH + "/" + contentElement.slug + "/" + contentElement.children[0].slug;
  }
  return (
    <Link to={link}>
      <li
        className={
          " flex items-center justify-between py-1 px-2 rounded transition-colors  " +
          (active ? "font-bold text-black bg-gray-200 hover:bg-gray-200" : " hover:bg-gray-100")
        }
      >
        {title}
        <div className={`rounded-full ${progressToColor(progress)} border-gray-600  border w-4 h-4`}></div>
      </li>
    </Link>
  );
};

const NextChapter = ({ slug, subslug, path }) => {
  const { getProgress } = useProgress();
  const progressHere = getProgress(path);

  const ourIndex = content.findIndex((c) => c.slug == slug);
  let ourChildrenIndex;
  let nextIsChapter = true;
  if (subslug) {
    ourChildrenIndex = content[ourIndex]?.children?.findIndex((c) => c.slug == subslug);
    if (ourChildrenIndex < content[ourIndex].children.length - 1) {
      nextIsChapter = false;
    }
  }

  return (
    progressHere > 0 && (
      <button
        className={`mt-8 flex font-light items-center border border-gray-400 rounded p-2 px-4
    hover:border-gray-600 transition-colors duration-150 hover:shadow-sm`}
        onClick={() => {
          if (nextIsChapter) {
            navigate(BASEPATH + "/" + content[ourIndex + 1].slug);
          } else {
            navigate(BASEPATH + "/" + slug + "/" + content[ourIndex].children[ourChildrenIndex + 1].slug);
          }
        }}
      >
        Go to the next {nextIsChapter ? "chapter" : "exercise"} →
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

const Vimeo = ({ id }) => (
  <iframe
    src={"https://player.vimeo.com/video/" + id}
    width="640"
    height="360"
    frameBorder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    allowFullScreen
  ></iframe>
);
