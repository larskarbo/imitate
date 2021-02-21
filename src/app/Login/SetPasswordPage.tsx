import React, { useEffect, useRef, useState } from "react";

import { FaGoogle } from "react-icons/fa";
import { navigate } from "gatsby";
import { useUser } from "../../user-context";
import { request } from "../utils/request";
import { useLocation } from "@reach/router";
import { parse } from "query-string";
import LoginLayout from "./LoginLayout";

export enum regType {
  LOGIN = "login",
  SET_PASSWORD = "set-password",
}

export default function SetPasswordPage({ mode }) {
  const formRef = useRef();
  const [msg, setMsg] = useState("");

  const location = useLocation();

  const searchParams = parse(location.search);
  if (!searchParams.email || !searchParams.token) {
    alert("Link is malformed, double check that you have the right link");
    navigate("/app/login");
  }

  useEffect(() => {
    request("GET", "/users").then((asdf) => {
      console.log("asdf: ", asdf);
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const email = formRef.current.email.value;
    const password = formRef.current.password.value;
    const passwordTwo = formRef.current.passwordTwo.value;

    if(password != passwordTwo){
      alert("Passwords don't match")
      return
    }

    if(password.length < 6){
      alert("Choose a password with at least 6 letters")
      return
    }

    
  };

  return (
    <LoginLayout>
      <form ref={formRef} onSubmit={onSubmit}>
        <div className="font-medium mb-4">Setting password</div>
        <input type="hidden" value={searchParams.token} />

        <FormElement
          title={"Email address"}
          type="email"
          name="email"
          placeholder="you@email.com"
          value={searchParams.email}
          disabled
        />

        <FormElement
          title={"Password"}
          type="password"
          name="password"
          placeholder="*******"
          // value={searchParams.email}
        />

        <FormElement
          title={"Confirm password"}
          type="password"
          name="passwordTwo"
          placeholder="*******"
          // value={searchParams.email}
        />

        <SubmitButton>Set password</SubmitButton>
      </form>
    </LoginLayout>
  );
}

const FormElement = ({ name, type = "text", title, value=null, disabled = false, placeholder }) => {
  return (
    <div className="pb-4">
      <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
        {title}
      </label>
      <div className="mt-1 rounded-md shadow-sm">
        <input
          id={name}
          type={type}
          disabled={disabled}
          tabIndex={1}
          name={name}
          value={value}
          placeholder={placeholder}
          required
          className={`block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out
                border border-gray-300 rounded-md appearance-none focus:outline-none
                focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5
                ${disabled ? "text-gray-500" : ""}
                `}
        />
      </div>
    </div>
  );
};

const SubmitButton = ({ children }) => {
  return (
    <div className="mb-4">
      <button
        type="submit"
        className="shadow-sm w-full flex justify-center cursor-pointer py-2 px-4 border
                border-transparent text-sm font-medium rounded-md text-white bg-gray-700
                 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out"
      >
        {children}
      </button>
    </div>
  );
};
