import React from "react";
import { navigate } from "gatsby";
import content from "./content.json";
import { useProgress } from "./progress-context";
import { BASEPATH } from "../pages/french/pronunciation-course";
import { Button } from "./Button";

export const NextChapter = ({ slug, subslug, path }) => {
  const { getProgress } = useProgress();
  const progressHere = getProgress(path);

  const ourIndex = content.findIndex((c) => c.slug == slug);
  let ourChildrenIndex;
  let nextIsChapter = true;
  if (subslug) {
    ourChildrenIndex = content[ourIndex]?.children?.findIndex((c) => c.slug == subslug);
    if (ourChildrenIndex < content[ourIndex].children.length - 1) {
      nextIsChapter = false;
    }
  }

  return (
    progressHere > 0 && (
      <Button
        onClick={() => {
          if (nextIsChapter) {
            navigate(BASEPATH + "/" + content[ourIndex + 1].slug);
          } else {
            navigate(BASEPATH + "/" + slug + "/" + content[ourIndex].children[ourChildrenIndex + 1].slug);
          }
        }}
      >
        Go to the next {nextIsChapter ? "chapter" : "exercise"} →
      </Button>
    )
  );
};


