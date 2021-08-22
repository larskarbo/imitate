import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { Header } from "./Header";

console.log("process.env.GATSBY_STRIPE_PUB_KEY: ", process.env.GATSBY_STRIPE_PUB_KEY);
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
        <article>Not logged in</article>
      </main>
    </div>
  );
}
