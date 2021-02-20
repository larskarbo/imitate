// src/playingNow-context.js
import * as React from "react";
import { useState, useEffect } from "react";
import { request } from '../app/utils/request';

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
    request("POST", "/setProgress/fpb/" + id, {
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
