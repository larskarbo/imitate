import React from "react";
import { useUser } from "../user-context";
import logo from "../pages/logo.svg";
import { Link } from "gatsby";
import { useMatch } from "@reach/router";
import { BASEPATH } from "../pages/french/pronunciation-course";

export function Header() {
  const { user, loadingUser } = useUser();

  const isHome = useMatch("/");
  const isApp = useMatch("/app/*");
  const isFPB = useMatch(BASEPATH + "/*");
  return (
    <header className="md:flex justify-between items-center w-full pt-8 max-w-screen-lg border-b pb-4 border-gray-300">
      <div className="md:flex font-light">
        <Link to="/">
          <div className="flex justify-center pl-4 pb-4 md:pb-0">
            <img src={logo} />
          </div>
        </Link>
        {(user) && (
          <Link to="/app">
            <div className={`flex justify-center pl-4 ${isApp && "font-semibold"}`}>Imitate Classic</div>
          </Link>
        )}
        {/* {user && ( */}
          <Link to={BASEPATH}>
            <div className={`flex justify-center pl-4 ${isFPB && "font-semibold"}`}>French Pronunciation Basics 🇫🇷</div>
          </Link>
      </div>

      <div className="flex justify-center pt-4 md:pt-0">
        {!user && !loadingUser && (
          <Link to="/app/login">
            <div className=" font-light  w-20">Log in</div>
          </Link>
        )}
        {user && (
          <div className="inline-flex w-20">
            {/* :) |{" "} */}
            <Link to="/app/logout">
              <div className=" font-light ml-1">Log out</div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
