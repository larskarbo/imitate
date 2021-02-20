import React from "react";
import { useUser } from "../user-context";
import logo from "./logo.svg";
import { Link } from "gatsby";

export function Header() {
  const { user, loadingUser } = useUser();
  return (
    <header className="flex justify-between items-center w-full pt-12">
      <Link to="/app">
        <div className="flex justify-center ">
          <img src={logo} />
        </div>
      </Link>
      {!user && !loadingUser && <Link to="/app/login"><div>Log in</div></Link>}
      {user && <div className="inline-flex">:) |{" "}<Link to="/app/logout"><div className="ml-1">Log out</div></Link></div>}
    </header>
  );
}
