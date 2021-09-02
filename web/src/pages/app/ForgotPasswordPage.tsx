import React, { useRef, useState } from "react";
import { getErrorMessage } from "../app/utils/getErrorMessage";
import { request } from "../app/utils/request";
import { FormElement } from "../app/Login/FormElement";
import LoginLayout from "../app/Login/LoginLayout";
import { SubmitButton } from "../app/Login/SubmitButton";

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

    setLoading(true);

    request("POST", "/forgotPassword", {
      email,
    })
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch(async (asdf) => {
        const errorMessage = getErrorMessage(asdf);
        setMsg(errorMessage);
        setLoading(false);
      });
  };

  return (
    <LoginLayout msg={msg}>
      {submitted ? (
        <div className="font-medium mb-4">
          Check your email for instructions on how to reset the password!
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="font-medium mb-4">Forgot your password?</div>

          <FormElement
            title={"Email address"}
            type="email"
            name="email"
            placeholder="you@email.com"
            value={""}
          />

          <SubmitButton>{loading ? "Loading" : "Reset password"}</SubmitButton>
        </form>
      )}
    </LoginLayout>
  );
}
