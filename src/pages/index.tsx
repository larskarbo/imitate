import { StaticImage } from "gatsby-plugin-image";
import React, { useRef, useState } from "react";

// import { Link, navigate } from 'gatsby';
import Helmet from 'react-helmet';
import logo from "./logo.svg"

export default function () {
  const formRef = useRef()
  const [sent, setSent] = useState(false)
  const onSubmit = (e) => {
    e.preventDefault()
    fetch("/.netlify/functions/newsletter", { method: "POST", body: JSON.stringify({ email: formRef.current.email.value }) })
      .then(a => {
        console.log("🚀 ~ a", a)
        setSent(true)
      })
      .catch(err => {
        console.log("🚀 ~ err", err)

      })
  }
  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen">


      <Helmet>
        <meta property="og:url" content="https://goimitate.com/" />
        <link rel="canonical" href="https://goimitate.com/" />
        <title>Imitate - Learn perfect pronunciation</title>
        <meta property="og:title" content={"Imitate - Learn perfect pronunciation"} />
        <meta name="twitter:title" content={"Imitate - Learn perfect pronunciation"} />
        <meta name="title" content={"Imitate - Learn perfect pronunciation"} />

        <meta name="description" content="" />
        <meta property="og:description" content="" />
        <meta name="twitter:description" content=" " />

        {/* <meta property="og:image" content="https://fileparty.co/fileparty-screenshot.png" />
        <meta name="twitter:image" content="https://fileparty.co/fileparty-screenshot.png" /> */}

        <meta property="og:site_name" content="Imitate" />
        <meta name="twitter:card" content="summary_large_image" />


        <meta
          name="twitter:creator"
          content={"larskarbo"}
        />
      </Helmet>

      <header>

        <div className="flex justify-center pt-12">
          <img src={logo} />
        </div>
      </header>

      <h1 className="text-5xl font-medium text-black text-center mt-20 mb-8">
        <div className="mb-1">Perfect pronounciation.</div>
        {/* <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
          play any media in sync
              </div> */}
      </h1>
      <h2 className="text-2xl font-regular max-w-sm text-black text-center mb-8">
        <div className="mb-1">Train your ears and voice to achieve <span className="bg-blue-200 inline-block text-blue-900 rounded-md px-1">near-native</span> pronounciation.</div>
        {/* <div className="">
          play any media in sync
              </div> */}
      </h2>

      <div className="text-left max-w-md w-full mb-12">
        {/* <p>I am: </p>
        <label htmlFor=""><input type="radio" /> Student</label>
        <input type="radio" /> Teacher */}
        {sent ?
          <div className="text-center text-sm">Awesome! You will be the first to try ⚡</div>
          : <form ref={formRef} onSubmit={onSubmit}>
            <div className="flex border border-gray-300 w-96 rounded overflow-hidden shadow-sm text-sm mx-auto">
              <input name="email" className="flex-grow px-4" type="email" placeholder="Your email" />
              <input className="px-4 py-2 bg-blue-50 border-l" type="submit" value="Be the first to try ⚡" />
            </div>
          </form>}
      </div>

      <StaticImage src="./screensh.jpg"
        // layout="fluid"
        alt="Screenshot Imitate"
        maxWidth={448} className="max-w-md rounded-lg" />

      <div className="mt-24">

        <a href="https://larskarbo.no" target="_blank">
          <div className=" flex items-center border border-gray-200 rounded p-2 px-4
          hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
          ">
            <StaticImage maxWidth={36} className="rounded-full mr-2" src="./pb.jpeg" />
            <div className="font-light">
              made by <strong className="font-bold">@larskarbo</strong>
            </div>
          </div>
        </a>
        {/* 
        <a href="https://www.producthunt.com/posts/fileparty?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-fileparty" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=279320&theme=light" alt="FileParty - Watch local files together in real time | Product Hunt"
          //  style="width: 250px; height: 54px;"
          className="mt-6"
          width="250" height="54" /></a> */}

      </div>

      <div className="pb-24"></div>
    </div>
  );
}

