import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Button } from "./Button";
import content from "./content.json";
import { Header } from "./Header";
import { NextChapter } from "./NextChapter";
import { ProgressProvider } from "./progress-context";
import SegmentPro from "./SegmentPro";
import { SelfAssessment } from "./SelfAssessment";
import { SidebarElement } from "./SidebarElement";
import { SmallNavElement } from "./SmallNavElement";
import { Vimeo } from "./Vimeo";

export default function CourseWrapper(props) {
  return (
    <ProgressProvider>
      <Course {...props} />
    </ProgressProvider>
  );
}

function Course({ slug, subslug }) {
  console.log('slug, subslug: ', slug, subslug);
  const [menuOpen, setMenuOpen] = useState(false);
  const overPage = content.find((c) => c.slug == slug);
  const router = useRouter();

  let page;
  let path;
  if (subslug) {
    page = overPage.children.find((c) => c.slug == subslug);
    path = slug + "/" + subslug;
  } else {
    page = overPage;
    path = slug;
  }


  useEffect(() => {
    if (page?.type == "collection" && !subslug) {
      router.push(
        "/french/pronunciation-course/" + slug + "/" + page?.children[0].slug
      );
    }
  }, [page?.type, subslug]);

  if(!page) {
    return null
  }
  
  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Header />

      <div className="w-full max-w-screen-lg md:flex">
        <div className="md:hidden">
          <Button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <>
                <FaTimes className="mr-1" /> Close
              </>
            ) : (
              <>
                <FaBars className="mr-1" /> Contents
              </>
            )}
          </Button>
        </div>
        <div className="pb-4"></div>
        <div
          className={`${
            menuOpen ? "" : "hidden"
          } md:block md:w-40 md:pt-8 flex-shrink-0 border-r font-light text-gray-700 pr-2`}
        >
          <ul>
            {content.map((c) => (
              <SidebarElement
                onGo={() => setMenuOpen(false)}
                key={c.slug}
                content={c}
                active={c.slug == overPage.slug}
              />
            ))}
          </ul>
        </div>

        <main
          className={`${
            menuOpen ? "hidden" : ""
          } md:block md:pl-12 w-full md:pt-8`}
        >
          {subslug && (
            <>
              <h1 className="text-4xl font-light pb-8">
                <span className="font-bold">
                  The{" "}
                  <span className="font-mono bg-gray-200 rounded-md font-bold">
                    [{overPage.phonetic}]
                  </span>{" "}
                  sound
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
              {page.title && (
                <h1 className="text-4xl font-bold pb-8">{page.title}</h1>
              )}
              {page.video && !subslug && <Vimeo id={page.video} />}
              {page.slug == "using-imita" && (
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
                  <p>
                    The exercises have example phrases. Your job is to imitate
                    them.
                  </p>
                  <img
                    src={"/tutorial.png"}
                    className="max-w-lg w-full border rounded-lg p-4 shadow-lg"
                  />
                  <p>By practicing like this you will learn two things:</p>
                  <p>👂 Train your ears to recognize sounds.</p>
                  <p>🗣 Train your voice to produce sounds.</p>
                  <p>
                    Remember to <strong>practice consistently</strong>, and you
                    will achieve great results.
                  </p>
                  <h2>Technical problems</h2>
                  <p>
                    The recording functionality might not work in all browsers.
                  </p>
                  <p>
                    👺 <strong>Problematic</strong>: iPhone, iPad, Safari.
                  </p>
                  <p>
                    ✅ <strong>Best</strong>: Google Chrome or Firefox on a
                    desktop or laptop computer.
                  </p>
                  <p>
                    I am working on making this work everywhere! In the
                    meantime, try to use the devices and browsers that work.
                  </p>
                </article>
              )}

              {subslug == "intro" && (
                <>
                  <h2 className="text-2xl font-semibold py-4">
                    How to make this sound:
                  </h2>
                  {page.video && <Vimeo id={page.video} />}
                  {page.spellingRules && (
                    <div className="pt-8">
                      <h2 className="text-2xl font-semibold pb-4">
                        Spelling rules:
                      </h2>
                      <ul className="list-disc pl-8 font-mono">
                        {page.spellingRules.map((spelling) => (
                          <li className="pt-2" key={spelling}>
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
          <div className="flex justify-end w-full">
            <a
              target="_blank"
              href="https://forms.gle/vYxYHtg3NpTibdtH8"
              className="inline-flex rounded items-center my-4 mx-auto justify-center text-sm py-3 px-6 bg-green-50 border-2  hover:bg-green-100 border-green-600 font-medium text-gray-900  transition duration-150"
            >
              Send feedback 🗣
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
