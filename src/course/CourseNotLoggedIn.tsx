import Head from "next/head";
import { useRef } from "react";
import { Header } from "./Header";

export default function CourseNotLoggedIn({}) {
  const formRef = useRef();

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Head>
        <title>French Pronunciation Course - Imitate</title>
        <meta
          name="description"
          content="The best interactive french pronunciation course. Guides you through all the fundamental sounds."
        />
      </Head>
      <Header />

      <div className="pb-8"></div>
      <main className={`md:block max-w-screen-lg w-full`}>
        <article>Not logged in</article>
      </main>
    </div>
  );
}
