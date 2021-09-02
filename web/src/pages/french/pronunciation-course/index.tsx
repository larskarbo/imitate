import ReactVimeo from "@u-wave/react-vimeo";
import Head from "next/head";
import React, { useRef } from "react";
import PayButton from "../../../course/PayButton";

export const BASEPATH = "/french/pronunciation-course";
export default function FPBLander({ slug, subslug }) {
  const formRef = useRef();

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Head>
        <title>French Pronunciation Course - Imitate</title>
        <meta
          name="description"
          content="The best interactive french pronunciation course. Guides you through all the fundational sounds."
        />
      </Head>
      <header className="md:flex justify-between items-center w-full pt-8 max-w-screen-lg border-b pb-4 border-gray-300">
        <div className="md:flex font-light">
          <div className="flex justify-center pl-4 pb-4 md:pb-0">
            <img src={"/logo.svg"} />
          </div>
          <div className={`flex justify-center pl-4 font-semibold`}>
            French Pronunciation Basics 🇫🇷
          </div>
        </div>

        <div className="flex justify-center pt-4 md:pt-0"></div>
      </header>

      <div className="pb-8"></div>
      <main className={`md:block max-w-screen-lg w-full`}>
        <article>
          <h1 className="text-5xl font-medium text-black text-center mt-8 mb-8">
            <div className="mb-1">Perfect French pronunciation?</div>
            {/* <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
          play any media in sync
              </div> */}
          </h1>
          <h2 className="text-2xl mx-auto font-regular max-w-sm text-black text-center mb-8">
            <div className="mb-1 font-light">
              Train your ears and voice to achieve{" "}
              <span className="font-medium inline-block rounded-md px-1">
                near-native
              </span>{" "}
              pronounciation.
            </div>
            {/* <div className="">
          play any media in sync
              </div> */}
          </h2>

          <ReactVimeo
            className="max-w-xl shadow mx-auto  rounded my-8"
            responsive
            video="https://vimeo.com/514712104/a37dc439b6"
          />

          <div className="relative bg-white pt-16 pb-16 ">
            <div className="relative">
              <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                  <div>
                    <div className="mt-6">
                      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        The <span className="text-blue-700">better</span> way to
                        learn pronunciation
                      </h2>
                      <p className="mt-4 text-lg text-gray-500">
                        The only way to pronounce things better is to hear how
                        you're <strong>actually</strong> pronouncing it!
                      </p>
                      <ul className="mt-4 text-lg text-gray-500 list-disc list-inside">
                        <li>Learn sounds one by one</li>
                        <li>Listen to yourself with practice chamber</li>
                        <li>Compare your recording with native speakers</li>
                        <li>Examples from movies</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-12 sm:mt-16 lg:mt-0">
                  <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                    <img
                      className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                      src="/bigs2.png"
                      alt="Imitate user interface"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="">
            <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:px-6 lg:px-8">
              <div className="py-12 px-4 sm:px-6 md:flex md:flex-col md:py-16 md:pl-0 md:pr-10  lg:pr-16">
                <blockquote className="mt-6 md:flex-grow md:flex md:flex-col">
                  <div className="relative text-lg font-medium text-gray-900 md:flex-grow">
                    <svg
                      className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-gray-200"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="relative">
                      I never realized the French essentially omit words in
                      normal speech. No wonder I cannot understand movies, etc.
                      Imitate is an excellent method to learn the pronunciation
                      properly!
                    </p>
                  </div>
                  <footer className="mt-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 inline-flex rounded-full ">
                        <img
                          className="h-12 w-12 rounded-full"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-medium text-gray-900">
                          Judith
                        </div>
                        <div className="text-base font-medium text-gray-600">
                          Imitate user
                        </div>
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </div>
              <div className="py-12 px-4  sm:px-6 md:py-16 md:pr-0 md:pl-10 md:border-t-0 ml lg:pl-16">
                <blockquote className="mt-6 md:flex-grow md:flex md:flex-col">
                  <div className="relative text-lg font-medium text-gray-900 md:flex-grow">
                    <svg
                      className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-gray-200"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="relative">
                      Wow! Hearing my mistakes recorded is such a great tool
                      without the embarrassment of a real live French speaker
                      laughing their socks off in my face is so nice, highly
                      recommended!
                    </p>
                  </div>
                  <footer className="mt-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 inline-flex rounded-full border-2 border-white">
                        <img
                          className="h-12 w-12 rounded-full"
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-medium text-gray-900">
                          Joseph
                        </div>
                        <div className="text-base font-medium text-gray-600">
                          Imitate user
                        </div>
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </section>

          <div className="bg-blue-50 max-w-md mx-auto border border-blue-400 rounded px-8 py-4">
            {/* <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            > */}
            <div className="flex items-center mb-4">
              <img
                className="rounded-full ring shadow inline"
                src="https://hatscripts.github.io/circle-flags/flags/fr.svg"
                width="32"
              />
              <div className="text-xl font-medium text-blue-900 ml-3">
                French Pronunciation Basics
              </div>
            </div>
            <h2 className="text-black mb-2 ">
              <s>89$</s>
              <span className=" font-bold "> Now only 25$!</span>
            </h2>
            <img
              src="/screenshot-fpb.png"
              className="w-48  border rounded border-gray-500"
            />
            <p className="text-black mb-2 my-2 text-sm ">
              French Pronunciation platform lifetime access.
            </p>

            {/* <p className="text-xs font-light opacity-60 mb-2 mt-1 ">Currently available for French learners only.</p> */}
            {/* </form> */}
            <PayButton />
          </div>

          <div className="flex my-16 max-w-md mx-auto">
            <img
              alt="imitate"
              className="rounded-full mr-2 w-9 h-9 flex-shrink-0"
              src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=72"
            />
            <div className="ml-2">
              <div className="border py-2 px-4 bg-white rounded mb-4">
                Hi! 👋 As a <strong>French learner</strong> I know how hard it
                can be to master pronunciation.
              </div>
              <div className={"border py-2 px-4 bg-white rounded mb-4"}>
                Many people settle on{" "}
                <span className="italic">"good enough"</span>, and never truly
                learn how to speak like a native.
              </div>
              <div className={"border py-2 px-4 bg-white rounded mb-4"}>
                That's why I created Imitate.
                <br />
                <br />
                It's an app that let's you <strong>
                  practice intonation
                </strong>{" "}
                with the use of <strong>real-world video</strong>.
              </div>
            </div>
          </div>

          <div className="flex mt-48 items-center">
            <img
              alt="Lars"
              className="rounded-full mr-2 w-8"
              src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=72"
            />
            <p className="text-xs">
              If you have questions or problems, please{" "}
              <a href={"mailto:imitate@larskarbo.no"}>email me</a>.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
