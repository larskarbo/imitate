import React from "react";
import { useProgress } from "./progress-context";
import { progressToColor } from "./utils/progressToColor";
import Link from "next/link";
import { BASEPATH } from "./Header";

export const SidebarElement = ({ onGo, content: contentElement, active }) => {
  const { getProgress } = useProgress();
  const progress = getProgress(contentElement.slug);
  const title = contentElement.title ? (
    <span>{contentElement.title}</span>
  ) : (
    <span>
      <span className="font-mono ">[{contentElement.phonetic}]</span>{" "}
      {contentElement.word}
    </span>
  );
  let link = BASEPATH + "/" + contentElement.slug;
  if (contentElement.type == "collection") {
    link =
      BASEPATH +
      "/" +
      contentElement.slug +
      "/" +
      contentElement.children[0].slug;
  }
  return (
    <Link href={link} legacyBehavior>
      <li
        onClick={onGo}
        className={
          " flex items-center justify-between py-1 px-2 rounded transition-colors  " +
          (active
            ? "font-bold text-black bg-gray-200 hover:bg-gray-200"
            : " hover:bg-gray-100")
        }
      >
        {title}
        <div
          className={`rounded-full ${progressToColor(
            progress
          )} border-gray-600  border w-4 h-4`}
        ></div>
      </li>
    </Link>
  );
};
