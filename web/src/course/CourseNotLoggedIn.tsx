import React, { useRef } from "react";
import { Header } from "./Header";
import { QuickSeo } from "next-quick-seo";

export default function CourseNotLoggedIn({}) {
  const formRef = useRef();

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <QuickSeo
        title="French Pronunciation Course - Imitate"
        description="The best interactive french pronunciation course. Guides you through all the fundational sounds."
      />
      <Header />

      <div className="pb-8"></div>
      <main className={`md:block max-w-screen-lg w-full`}>
        <article>Not logged in</article>
      </main>
    </div>
  );
}
