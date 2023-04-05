import { useRouter } from "next/router";
import React from "react";
import { Button } from "./Button";
import content from "./content.json";
import { BASEPATH } from "./Header";
import { useProgress } from "./progress-context";

export const NextChapter = ({ slug, subslug, path }) => {
  const { getProgress } = useProgress();
  const progressHere = getProgress(path);
  const router = useRouter();

  const ourIndex = content.findIndex((c) => c.slug == slug);
  let ourChildrenIndex;
  let nextIsChapter = true;
  if (subslug) {
    ourChildrenIndex = content[ourIndex]?.children?.findIndex(
      (c) => c.slug == subslug
    );
    if (ourChildrenIndex < content[ourIndex].children.length - 1) {
      nextIsChapter = false;
    }
  }

  return (
    progressHere > 0 && (
      <Button
        onClick={() => {
          if (nextIsChapter) {
            router.push(BASEPATH + "/" + content[ourIndex + 1].slug);
          } else {
            router.push(
              BASEPATH +
                "/" +
                slug +
                "/" +
                content[ourIndex].children[ourChildrenIndex + 1].slug
            );
          }
        }}
      >
        Go to the next {nextIsChapter ? "chapter" : "exercise"} →
      </Button>
    )
  );
};
