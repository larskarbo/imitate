import React, { useEffect, useState } from "react";
import { Header } from "./Header";

export default function CourseNotLoggedIn({ slug, subslug }) {

  return (
    <div className=" flex flex-col items-center px-8 w-full pb-24">
      <Header />

      <div className="pb-8"></div>
      <main className={`md:block md:pl-12 w-full`}>not logged in</main>
    </div>
  );
}
