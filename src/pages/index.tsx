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
        :<form ref={formRef} onSubmit={onSubmit}>
          <div className="flex border border-gray-300 w-96 rounded overflow-hidden shadow-sm text-sm mx-auto">
            <input name="email" className="flex-grow px-4" type="email" placeholder="Your email" />
            <input className="px-4 py-2 bg-blue-50 border-l" type="submit" value="Be the first to try ⚡" />
          </div>
        </form>}
      </div>

      <StaticImage src="./screensh.jpg" width={448} className="max-w-md rounded-lg" />

      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-3">

          {/* <button className="rounded mx-2 text-center font-normal w-40 p-3 px-5  bg-blue-500 text-white">Create room</button> */}
          {/* <Link to="/app/create" className="rounded mx-2 text-center font-normal w-40 p-3 px-5 opacity-0 absolute left-0 z-20" >Create room</Link> */}
        </div>
      </div>
    </div>
  );
}

