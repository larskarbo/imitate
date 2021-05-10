import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import { Helmet } from 'react-helmet';

export default function CourseNotLoggedIn({ slug, subslug }) {
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
          <h1 className="text-2xl font-bold pb-4">French Pronunciation Basics</h1>
          <p>You can buy access to this course <Link target="_blank" to={"https://gum.co/zXdoq"}>here</Link>.</p>
          <p>If you already bought, you will receive an email soon with instructions to set a password 🙌.</p>
          <p>When you have your password, <Link to={"/app/login"}>log in here</Link>.</p>
          <p>If you have questions or problems, please <a href={"mailto:imitate@larskarbo.no"}>email me</a>.</p>
          <p>Thanks,</p>
          <p>Lars</p>
        </article>
      </main>
    </div>
  );
}
