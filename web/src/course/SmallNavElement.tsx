import React from "react";
import { useProgress } from "./progress-context";
import { BASEPATH } from "../pages/french/pronunciation-course";
import { progressToColor } from "./utils/progressToColor";
import Link from "next/link";

export const SmallNavElement = ({ parent, element, active, index }) => {
  const { getProgress } = useProgress();
  const progress = getProgress(parent.slug + "/" + element.slug);
  const link = BASEPATH + "/" + parent.slug + "/" + element.slug;

  return (
    <Link href={link} legacyBehavior>
      <button className={`h-8 w-8 flex items-center justify-center mr-2 border ${active && "border-gray-800"} ${progress > 1 && progressToColor(progress)} bg-opacity-50 rounded ` + (active ? "font-bold" : "")}>{index + 1}</button>
    </Link>
  );
};
