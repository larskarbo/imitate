// src/playingNow-context.js
import * as React from "react";
import { useState, useEffect } from "react";
import { request } from "./app/utils/request";
import { navigate } from 'gatsby';

const UserContext = React.createContext(null);

// const spotifyOriginal = new Spotify()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [updater, setUpdater] = useState(0);

  useEffect(() => {
    request("GET", "/getUser")
      .then((user) => {
        setUser(user);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [updater]);

  const logoutUser = () => {
    request("GET", "/logout").then(() => {
      navigate("/")
      setUser(null)
    })
  }

  const tryAgainUser = () => {
    setUpdater(Math.random())
  }

  const isAuthenticated = false;

  return <UserContext.Provider value={{ user, isAuthenticated, logoutUser, tryAgainUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
