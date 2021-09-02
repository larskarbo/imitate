// src/playingNow-context.js
import * as React from "react";
import { useState, useEffect } from "react";
import { request } from '../app/utils/request';
import content from "./content.json";

const ProgressContext = React.createContext(null);

// const spotifyOriginal = new Spotify()

export function ProgressProvider({ children }) {
  const [progress, setProgressState] = useState(null);

  useEffect(() => {
    request("GET", "/progress/fpb").then((asdf) => {
      setProgressState(asdf);
    });
  }, []);

  const setProgress = (id, p, cb) => {
    request("POST", "/setProgress/fpb", {
      key: id,
      progress: p
    }).then(a => {
      setProgressState({
        ...progress,
        [id]: a.progress
      })
      cb?.()
    })
  }

  const getProgress = (id, p, cb) => {
    const overPage = content.find(c => c.slug == id)
    // console.log('overPage: ', overPage);
    if(overPage){
      if(overPage.type == "article"){
        return progress?.[id] || 0
      } else {
        let progressTotal = 0;
  
        overPage.children?.forEach((child) => {
          if (progress?.[overPage.slug + "/" + child.slug]) {
            progressTotal += progress[overPage.slug + "/" + child.slug];
          }
        });

        return progressTotal / overPage.children.length

      }


    }
    return progress?.[id] || 0
  }

  return <ProgressContext.Provider value={{ progress, setProgress, getProgress }}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = React.useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
