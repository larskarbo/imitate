import React, { useEffect, useRef, useState } from "react";

import { FaGoogle } from "react-icons/fa";
import { navigate } from "gatsby";
import { useUser } from "../../user-context";
import { request } from "../utils/request";
import { useLocation } from "@reach/router";
import { parse } from "query-string";
import LoginLayout from "./LoginLayout";
import { FormElement } from "./FormElement";
import { SubmitButton } from "./SubmitButton";

export enum regType {
  LOGIN = "login",
  SET_PASSWORD = "set-password",
}

export default function SetPasswordPage({ mode }) {
  const { tryAgainUser} = useUser()
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
    const token = formRef.current.token.value;

    if (password != passwordTwo) {
      alert("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      alert("Choose a password with at least 6 letters");
      return;
    }

    request("POST", "/setPassword", {
      email,
      password,
      token,
    }).then((user) => {
      tryAgainUser()
      navigate("/french/pronunciation-course");

    })
    .catch(async asdf=>{
      const response = await asdf?.response?.json()
      if(response?.message == "email not found"){
        alert("Email not found in database...")
        return
      }
      if(response?.message == "wrong token"){
        alert("The token is wrong or outdated...")
        return
      }

      alert("Some error...")

    })
    // signupUser(email, password)
    //   .catch((err) => setMsg("Error: " + err.message));
  };

  return (
    <LoginLayout>
      <form ref={formRef} onSubmit={onSubmit}>
        <div className="font-medium mb-4">Setting password</div>
        <input type="hidden" name={"token"} value={searchParams.token} />

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

        <SubmitButton>Set password and log in</SubmitButton>
      </form>
    </LoginLayout>
  );
}


