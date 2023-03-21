import Link from "next/link";
import React from "react";
import { BASEPATH } from "../pages/french/pronunciation-course";
import { useUser } from "../user-context";

export function Header() {
  const { user, loadingUser } = useUser();

  const isHome = false; //useMatch("/");
  const isApp = false; //useMatch("/app/*");
  const isLogin = false; //useMatch("/app/login");
  const isFPB = false; //useMatch(BASEPATH + "/*");
  return (
    <header className="md:flex justify-between items-center w-full pt-8 max-w-screen-lg border-b pb-4 border-gray-300">
      <div className="md:flex font-light">
        <Link href="/" className="flex justify-center pl-4 pb-4 md:pb-0">

          <img src={"/logo.svg"} />

        </Link>
        {user && (
          <Link
            href="/app"
            className={`flex justify-center pl-4 ${isApp && "font-semibold"}`}>
            
              Imitate Classic
            
          </Link>
        )}
        {/* {user && ( */}
        <Link
          href={BASEPATH}
          className={`flex justify-center pl-4 ${isFPB && "font-semibold"}`}>
          
            French Pronunciation Basics 🇫🇷
          
        </Link>
      </div>

      <div className="flex justify-center pt-4 md:pt-0">
        {!user && !loadingUser && (
          <Link
            href="/app/login"
            className={` font-light  w-20 ${isLogin && "font-semibold"}`}>
            
              Log in
            
          </Link>
        )}
        {user && (
          <div className="inline-flex w-20">
            {/* :) |{" "} */}
            <Link href="/app/logout" className=" font-light ml-1">
              Log out
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
