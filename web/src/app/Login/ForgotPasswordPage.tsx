import React, { useEffect, useRef, useState } from "react";

import { FaGoogle } from "react-icons/fa";
import { Link, navigate } from "gatsby";
import { useUser } from "../../user-context";
import { request } from "../utils/request";
import { useLocation } from "@reach/router";
import { parse } from "query-string";
import LoginLayout from "./LoginLayout";
import { FormElement } from "./FormElement";
import { SubmitButton } from "./SubmitButton";
import * as Sentry from "@sentry/gatsby";
import { getErrorMessage } from "../utils/getErrorMessage";
console.log("Sentry: ", Sentry);
export enum regType {
  LOGIN = "login",
  SET_PASSWORD = "set-password",
}

export default function ForgotPasswordPage({ mode }) {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    const email = formRef.current.email.value;

    setLoading(true)

    request("POST", "/forgotPassword", {
      email,
    })
      .then(() => {
        setSubmitted(true);
        setLoading(false)
      })
      .catch(async (asdf) => {
        const errorMessage = getErrorMessage(asdf);
        setMsg(errorMessage);
        setLoading(false)
      });

  };

  return (
    <LoginLayout msg={msg}>
      {submitted ? (
        <div className="font-medium mb-4">Check your email for instructions on how to reset the password!</div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="font-medium mb-4">Forgot your password?</div>

          <FormElement title={"Email address"} type="email" name="email" placeholder="you@email.com" value={""} />

          <SubmitButton>{loading ? "Loading": "Reset password"}</SubmitButton>
        </form>
      )}
    </LoginLayout>
  );
}
