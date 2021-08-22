import React from "react";
import { Helmet } from "react-helmet";
import { Header } from "../course/Header";

export default function ThankYou() {
  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Helmet>
        <title>Thank You - Imitate</title>
      </Helmet>
      <Header />

      <div className="pb-8"></div>
      <main className={`md:block max-w-screen-lg w-full`}>
        <article>
          <h1 className="text-5xl font-medium text-black text-center mt-20 mb-8">
            <div className="mb-1">Thank you!</div>
            {/* <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
          play any media in sync
              </div> */}
          </h1>
          <h2 className="text-2xl mx-auto font-regular max-w-sm text-black text-center mb-8">
            <div className="mb-1 font-light">Check your mail for instruction to how to access the course.</div>
            {/* <div className="">
          play any media in sync
              </div> */}
          </h2>

          <p className="text-xs mt-48">
            If you have questions or problems, please <a href={"mailto:imitate@larskarbo.no"}>email me</a>.
          </p>
        </article>
      </main>
    </div>
  );
}
