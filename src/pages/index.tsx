import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";
import { request } from "../application/utils/request";
import { Header } from "../course/Header";

const showEmailBox = false;
export default function Index() {
  const formRef = useRef();
  const router = useRouter();
  const onSubmit = (e) => {
    e.preventDefault();

    request("POST", "/newsletter", {
      //@ts-ignore
      email: formRef.current.email.value,
      language: "french",
    }).then((a) => {
      router.push("/app");
    });
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
      </h1>
      <h2 className="text-2xl font-regular max-w-sm text-black text-center mb-8">
        <div className="mb-1 font-light">
          Train your ears and voice to achieve{" "}
          <span className="font-medium inline-block rounded-md px-1">
            near-native
          </span>{" "}
          pronounciation.
        </div>
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

        {showEmailBox && (
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
            </form>
          </div>
        )}
      </div>

      <img
        src="/screensh.jpg"
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
