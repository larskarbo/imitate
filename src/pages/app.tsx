import React, { useContext, useEffect, useState } from "react";

import { Router, Redirect } from "@reach/router";
import { Link, navigate } from "gatsby";
import Main from "../app/Main";
import LoginPage from '../app/LoginPage';
import { useUser } from "../user-context";
import { request } from '../app/utils/request';

const url = "https://slapper.io";

export default function AppRouter() {
  return <Routing />;
}

function Routing() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen w-full">
        <>
          {/* <Helmet>
        <meta
          name="description"
          content="Organize and annotate songs and segments from Spotify, Youtube, Soundcloud in interactive, shareable documents"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dfzqjzusj/image/upload/c_fill,g_north,h_630,w_1200/v1605177986/CleanShot_2020-11-12_at_11.45.29_2x.png"
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/dfzqjzusj/image/upload/c_fill,g_north,h_630,w_1200/v1605177986/CleanShot_2020-11-12_at_11.45.29_2x.png"
        />
      </Helmet> */}
          <Router basepath="/app">
            <LogOut path="/logout" />
            <LoginRoute component={LoginPage} path="/login" />
            <Main path="/" />
            <Main path="/:segmentId" />
            <NotFound default />
            {/* <Croaker default loadingUser={loadingUser} user={user} /> */}
          </Router>
        </>
    </div>
  );
}

const LoginRoute = ({ component: Component, ...rest }) => {
  // const { isAuthenticated } = useUser()
  // if (isAuthenticated) {
  //   navigate("/app", { replace: true })
  //   return null
  // }
  return <Component {...rest} />
}

const NotFound = () => <div>not found</div>;

const LogOut = () => {
  const {logoutUser} = useUser()

  useEffect(() => {
    logoutUser();
  });
  return <div>Logged out</div>;
};
