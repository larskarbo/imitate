import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { Header } from "../course/Header";

export default function Index() {
  const formRef = useRef();
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const onSubmit = (e) => {
    e.preventDefault();
    fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({
        email: formRef.current.email.value,
        language: "french",
      }),
    })
      .then((a) => {
        console.log("a: ", a);

        // setSent(true);
        // router.push("/app");
      })
      .catch((err) => {});
  };
  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen">
      <Head>
        <meta property="og:url" content="https://goimitate.com/" />
        <link rel="canonical" href="https://goimitate.com/" />
        <title>Imitate - Learn perfect pronunciation</title>
        <meta
          property="og:title"
          content={"Imitate - Learn perfect pronunciation"}
        />
        <meta
          name="twitter:title"
          content={"Imitate - Learn perfect pronunciation"}
        />
        <meta name="title" content={"Imitate - Learn perfect pronunciation"} />

        <meta
          name="description"
          content="Imitate is a pronunciation learning tool that lets you achieve near-native pronunciation with the help of real-life video."
        />
        <meta
          property="og:description"
          content="Imitate is a pronunciation learning tool that lets you achieve near-native pronunciation with the help of real-life video."
        />
        <meta
          name="twitter:description"
          content="Imitate is a pronunciation learning tool that lets you achieve near-native pronunciation with the help of real-life video."
        />

        <meta property="og:image" content="https://goimitate.com/hero.png" />
        <meta name="twitter:image" content="https://goimitate.com/hero.png" />

        <meta property="og:site_name" content="Imitate" />
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:creator" content={"larskarbo"} />
      </Head>

      <Header />

      <h1 className="text-5xl font-medium text-black text-center mt-20 mb-8">
        <div className="mb-1">Perfect pronunciation.</div>
        {/* <div className="bg-blue-200 inline-block text-blue-800 rounded-md p-2 px-4">
          play any media in sync
              </div> */}
      </h1>
      <h2 className="text-2xl font-regular max-w-sm text-black text-center mb-8">
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

      <div className="text-left max-w-md w-full mb-12">
        <div className="flex mb-8">
          <img
            alt="imitate"
            className="rounded-full mr-2 w-9 h-9 flex-shrink-0"
            src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=72"
          />
          <div className="ml-2">
            <div className="border py-2 px-4 bg-white rounded mb-4">
              Hi! 👋 As a <strong>french learner</strong> I know how hard it can
              be to master pronunciation.
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

        <div className="bg-blue-50 border border-blue-400 rounded px-8 py-4">
          <form ref={formRef} onSubmit={onSubmit}>
            <div className="flex items-center mb-4">
              <img
                className="rounded-full ring shadow inline"
                src="https://hatscripts.github.io/circle-flags/flags/fr.svg"
                width="32"
              />
              <div className="text-xl font-medium text-blue-900 ml-3">
                French
              </div>
            </div>
            <h2 className="text-black font-bold mb-2 ">
              Imitate is free while in beta
            </h2>
            <p className="text-black mb-2 ">
              Enter your email to try it right now.
            </p>
            <div className=" mb-4 flex border border-gray-300 w-96 rounded overflow-hidden text-sm">
              <input
                required
                name="email"
                className="flex-grow px-4 py-2"
                type="email"
                placeholder="Your email"
              />
            </div>
            <button
              className=" mb-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 border border-gray-400 hover:border-gray-500 shadow-sm text-sm rounded transition-colors"
              type="submit"
            >
              Try Imitate for French ⚡
            </button>
            {/* <p className="text-xs font-light opacity-60 mb-2 mt-1 ">Currently available for French learners only.</p> */}
          </form>
        </div>

        <Other />
      </div>

      <img
        src="/screensh.jpg"
        // layout="fluid"
        alt="Screenshot Imitate"
        className="max-w-md rounded-lg"
      />

      <div className="mt-24">
        <a href="https://larskarbo.no" target="_blank">
          <div
            className=" flex items-center border border-gray-200 rounded p-2 px-4
                hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
                "
          >
            <img
              alt="Lars"
              className="rounded-full mr-2 w-8"
              src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=72"
            />
            <div className="font-light">
              made by <strong className="font-bold">@larskarbo</strong>
            </div>
          </div>
        </a>
        <a
          href="https://www.producthunt.com/posts/imitate?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-imitate"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=282675&theme=light"
            alt="Imitate | Product Hunt"
            //  style="width: 250px; height: 54px;"
            className="mt-6"
            width="250"
            height="54"
          />
        </a>
      </div>

      <div className="pb-24"></div>
    </div>
  );
}

const languages = [
  {
    name: "English",
    code: "us",
  },
  {
    name: "Chinese",
    code: "cn",
  },
  {
    name: "Russian",
    code: "ru",
  },
  {
    name: "German",
    code: "de",
  },
  {
    name: "Norwegian",
    code: "no",
  },
  {
    name: "Other",
  },
];

export function Other() {
  const [language, setLanguage] = useState(null);
  const [sent, setSent] = useState(false);
  const formRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    fetch("/.netlify/functions/newsletter", {
      method: "POST",
      body: JSON.stringify({
        email: formRef.current.email.value,
        language:
          formRef.current.otherLanguage?.value || language.name.toLowerCase(),
      }),
    })
      .then((a) => {
        console.log("a: ", a);

        setSent(true);
      })
      .catch((err) => {});
  };

  if (language) {
    return (
      <div className="mt-12 bg-yellow-50 border border-yellow-400 rounded px-8 py-4">
        <button
          onClick={() => {
            setLanguage(null);
            setSent(false);
          }}
          className="text-xs mb-4 hover:underline text-gray-800 font-light"
        >
          ← Go back
        </button>
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="flex items-center mb-4">
            {language.code ? (
              <img
                className="rounded-full ring ring-gray-300 shadow "
                src={`https://hatscripts.github.io/circle-flags/flags/${language.code}.svg`}
                width="32"
              />
            ) : (
              <AiFillQuestionCircle size={32} color="gray" />
            )}
            <div className="text-xl font-medium  ml-3">{language.name}</div>
          </div>
          {sent ? (
            <>
              <h2 className="text-black font-bold mb-2 ">Thank you!</h2>
              <p className="text-black mb-2 ">
                I will let you know when it is available.
              </p>
            </>
          ) : language.name == "Other" ? (
            <>
              <h2 className="text-black font-bold mb-2 ">
                Which language would you like Imitate for?
              </h2>
              <div className=" mb-2 flex border border-gray-300 w-96 rounded overflow-hidden text-sm">
                <input
                  required
                  name="otherLanguage"
                  className="flex-grow px-4 py-2"
                  type="texts"
                  placeholder="A language..."
                />
              </div>
              <div className=" mb-4 flex border border-gray-300 w-96 rounded overflow-hidden text-sm">
                <input
                  required
                  name="email"
                  className="flex-grow px-4 py-2"
                  type="email"
                  placeholder="Your email"
                />
              </div>
              <button
                className=" mb-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 border border-gray-400 hover:border-gray-500 shadow-sm text-sm rounded transition-colors"
                type="submit"
              >
                Get notified ⚡
              </button>
            </>
          ) : (
            <>
              <h2 className="text-black font-bold mb-2 ">
                Imitate for {language.name} is not yet available.
              </h2>
              <p className="text-black mb-2 ">
                Enter your email to be one of the first to try it.
              </p>
              <div className=" mb-4 flex border border-gray-300 w-96 rounded overflow-hidden text-sm">
                <input
                  required
                  name="email"
                  className="flex-grow px-4 py-2"
                  type="email"
                  placeholder="Your email"
                />
              </div>
              <button
                className=" mb-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 border border-gray-400 hover:border-gray-500 shadow-sm text-sm rounded transition-colors"
                type="submit"
              >
                Sign up for the {language.name} wait list ⚡
              </button>
            </>
          )}
          {/* <p className="text-xs font-light opacity-60 mb-2 mt-1 ">Currently available for French learners only.</p> */}
        </form>
      </div>
    );
  }

  return (
    <>
      <h3 className="mt-12 mb-4 text-lg font-medium text-center">
        Other languages:
      </h3>
      <div className="flex flex-wrap justify-center">
        {languages.map((l) => (
          <button
            onClick={() => setLanguage(l)}
            key={l.name}
            className="bg-gray-50 border border-gray-400 rounded px-8 py-4 flex items-center mr-4 mb-4 w-5/12 hover:bg-gray-100 transition-colors"
          >
            {l.code ? (
              <img
                className="rounded-full ring ring-gray-300 shadow "
                src={`https://hatscripts.github.io/circle-flags/flags/${l.code}.svg`}
                width="32"
              />
            ) : (
              <AiFillQuestionCircle size={32} color="gray" />
            )}
            <div className="text-xl font-light text-gray-900 ml-3 mr-4">
              {l.name}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
