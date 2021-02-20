// src/playingNow-context.js
import * as React from "react";
import { useState, useEffect } from "react";
import { request } from '../app/utils/request';
import content from "./content";

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
    console.log('id: ', id);
    const page = content.find(c => c.slug == id)
    // console.log('page: ', page);
    if(page){
      if(page.title){
        return progress?.[id] || 0
      } else {
        if(page.exercises.length == 0){
          return 0
        }
        let progressTotal = 0;
  
        page.exercises?.forEach((e) => {
          if (progress?.[page.slug + "/" + e.id]) {
            progressTotal += progress[page.slug + "/" + e.id];
          }
        });

        return progressTotal / page.exercises.length

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
