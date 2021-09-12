// src/playingNow-context.js
import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useState } from "react";
import { request } from "./app/utils/request";

const UserContext = React.createContext({});

// const spotifyOriginal = new Spotify()

export function UserProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [updater, setUpdater] = useState(0);

  useEffect(() => {
    request("GET", "/getUser")
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        console.log("Not authed");
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [updater]);

  const logoutUser = () => {
    request("GET", "/logout").then(() => {
      setUser(null);
      router.push("/");
    });
  };

  const tryAgainUser = () => {
    setUpdater(Math.random());
  };

  const isAuthenticated = false;

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: loadingUser,
        logoutUser,
        tryAgainUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): any {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
