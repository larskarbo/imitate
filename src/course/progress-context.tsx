// src/playingNow-context.js
import * as React from "react";
import content from "./content.json";

const ProgressContext = React.createContext(null);

import { useAtom } from "jotai/react";
import { atomWithStorage } from "jotai/utils";

export const progressAtom = atomWithStorage<Record<string, number>>(
  "progress",
  {}
);

export function ProgressProvider({ children }) {
  const [progressObject, setProgressObject] = useAtom(progressAtom);

  const setProgress = (id: string, p: number) => {
    setProgressObject({
      ...progressObject,
      [id]: p,
    });
  };

  const getProgress = (id: string) => {
    const overPage = content.find((c) => c.slug == id);
    if (overPage) {
      if (overPage.type == "article") {
        return progressObject?.[id] || 0;
      } else {
        let progressTotal = 0;

        overPage.children?.forEach((child) => {
          if (progressObject?.[overPage.slug + "/" + child.slug]) {
            progressTotal += progressObject[overPage.slug + "/" + child.slug];
          }
        });

        return progressTotal / overPage.children.length;
      }
    }
    return progressObject?.[id] || 0;
  };

  return (
    <ProgressContext.Provider
      value={{ progress: progressObject, setProgress, getProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = React.useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
