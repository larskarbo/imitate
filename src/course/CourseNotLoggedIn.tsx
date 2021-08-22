import { Link } from "gatsby";
import React, { useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { Helmet } from "react-helmet";
import { StaticImage } from "gatsby-plugin-image";
import { BASE } from "../app/utils/request";
import { loadStripe } from "@stripe/stripe-js/pure";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { getErrorMessage } from "../app/utils/getErrorMessage";
import PayButton from "./PayButton";

console.log('process.env.GATSBY_STRIPE_PUB_KEY: ', process.env.GATSBY_STRIPE_PUB_KEY);
export default function CourseNotLoggedIn({ slug, subslug }) {
  const formRef = useRef();
  

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Helmet>
        <title>French Pronunciation Course - Imitate</title>
        <meta
          name="description"
          content="The best interactive french pronunciation course. Guides you through all the fundational sounds."
        />
      </Helmet>
      <Header />

      <div className="pb-8"></div>
      <main className={`md:block max-w-screen-lg w-full`}>
        <article>
          <h1 className="text-5xl font-medium text-black text-center mt-20 mb-8">
            <div className="mb-1">Perfect pronunciation?</div>
            {/* <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
          play any media in sync
              </div> */}
          </h1>
          <h2 className="text-2xl mx-auto font-regular max-w-sm text-black text-center mb-8">
            <div className="mb-1 font-light">
              Train your ears and voice to achieve{" "}
              <span className="font-medium inline-block rounded-md px-1">near-native</span> pronounciation.
            </div>
            {/* <div className="">
          play any media in sync
              </div> */}
          </h2>

          <img src="/screenshot-fpb.png" className="max-w-xl shadow mx-auto border rounded border-gray-500" />

          <div className="text-left max-w-md mx-auto flex w-full mb-12">
            <div className="flex mb-8"></div>
            <StaticImage alt="imitate" width={36} className="rounded-full mr-2 w-9 h-9 flex-shrink-0" src="./pb.jpeg" />
            <div className="ml-2">
              <div className="border py-2 px-4 bg-white rounded mb-4">
                Hi! 👋 As a <strong>french learner</strong> I know how hard it can be to master pronunciation.
              </div>

              <div className={"border py-2 px-4 bg-white rounded mb-4"}>
                Many people settle on <span className="italic">"good enough"</span>, and never truly learn how to speak
                like a native.
              </div>
              <div className={"border py-2 px-4 bg-white rounded mb-4"}>
                That's why I created Imitate.
                <br />
                <br />
                It's an app that let's you <strong>practice intonation</strong> with the use of{" "}
                <strong>real-world video</strong>.
              </div>
            </div>
          </div>

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
              <div className="text-xl font-medium text-blue-900 ml-3">French Pronunciation Basics</div>
            </div>
            <h2 className="text-black font-bold mb-2 ">Buy it today!</h2>
            <p className="text-black mb-2 ">Start learning pronunciation with good tools.</p>
            
            {/* <p className="text-xs font-light opacity-60 mb-2 mt-1 ">Currently available for French learners only.</p> */}
            {/* </form> */}
            <PayButton />
          </div>

          <p className="text-xs mt-48">
            If you have questions or problems, please <a href={"mailto:imitate@larskarbo.no"}>email me</a>.
          </p>
        </article>
      </main>
    </div>
  );
}
