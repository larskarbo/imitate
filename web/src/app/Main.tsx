import React, { useContext, useEffect, useState } from "react";
import Segment from "./Segment";
import axios from "axios";
import { navigate, Link } from "gatsby";
import expl from "./expl.svg";

// const segmentInfo = {
//     videoId: "oTKWwVrCrI8",
//     from: 800,
//     to: 4659,
//     text: "Est-ce que vous savez quelle est la question préférée des profs de français ?"
// }

const segmentInfo = {
  videoId: "t-LsjB45tOg",
  from: 474080,
  to: 474080 + 5640,
  text: "Donc on prend un verbe anglais et on va le franciser en mettant une terminaison française.",
};

// https://www.youtube.com/watch?v=t-LsjB45tOg

export default function Main({ segmentId }) {
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

  return (
    <>
      <div className="max-w-3xl flex flex-col items-center px-8 w-full pb-24">
        <div className="pb-8"></div>
        {segmentId && (
          <>
            <Segment loading={loading} segmentId={segmentId} newSegment={newSegment} />
            <div className="pt-8"></div>
            <div className="pt-8 border-t border-gray-300 w-full"></div>

            <div className="flex justify-center w-full">
              <div className="max-w-md w-full">
                <div className="bg-white px-8 py-4 mb-8 rounded border w-full text-sm">
                  <p className="my-2 italic">Imitate is the start of something big.</p>
                  <p className="my-2">
                    Do you want to send recordings to your teacher? Input any youtube video? Use other formats like
                    podcasts? Phonetics?
                  </p>
                  <p className="my-2">
                    <strong>Imitate will change the way we learn to pronounce.</strong> I believe it happens through
                    practice, and I need your ideas on how to develop this tool.
                  </p>
                  <p className="my-2">Send me your thoughts here:</p>
                  <div className="flex justify-center">
                    <Link
                      to="https://docs.google.com/forms/d/e/1FAIpQLScewq4uRUFV6XJcA2KCQavxNxpXw5a_oCNpjr3o2PAQNc5Otw/viewform?usp=sf_link"
                      className="inline-flex rounded items-center my-4 mx-auto justify-center text-sm py-3 px-6 bg-green-50 border-2  hover:bg-green-100 border-green-600 font-medium text-gray-900  transition duration-150"
                    >
                      Send feedback 🗣
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!segmentId && (
          <div className="max-w-md">
            <div className="bg-white px-8 py-4 mb-8 rounded border w-full">
              <h1>Welcome to Imitate!</h1>
              <p className="my-2">
                Imitate gives you a random sentence. Listen to the real-life video, then record yourself. Try to produce
                the <strong>exact same sounds</strong>.
              </p>
              <img className="mx-auto my-8" src={expl} />
              <p className="my-2">👂 Train your ears to recognize sounds.</p>
              <p className="my-2">🗣 Train your voice to produce sounds.</p>
              <p className="my-2">
                Remember to <strong>practice consistently</strong>, and you will achieve great results.
              </p>
              <button
                onClick={newSegment}
                className="mt-12 rounded items-center my-8 mx-auto justify-center text-sm flex py-3 px-6 bg-green-50 border-2  hover:bg-green-100 border-green-600 font-medium text-gray-900  transition duration-150"
              >
                Get my first sentence 🇫🇷
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
