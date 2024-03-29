import React, { useRef, useState } from "react";
import { getErrorMessage } from "get-error-message";
import { request } from "../../application/utils/request";
import { FormElement } from "../../application/Login/FormElement";
import LoginLayout from "../../application/Login/LoginLayout";
import { SubmitButton } from "../../application/Login/SubmitButton";

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

        //@ts-ignore
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
