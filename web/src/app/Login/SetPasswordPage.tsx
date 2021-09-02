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
console.log("Sentry: ", Sentry);
export enum regType {
  LOGIN = "login",
  SET_PASSWORD = "set-password",
}

export default function SetPasswordPage({ mode }) {
  const { tryAgainUser } = useUser();
  const formRef = useRef();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [verifyError, setVerifyError] = useState(false);

  const location = useLocation();
  const searchParams = parse(location.search);
  if (!searchParams.utoken) {
    alert("Link is malformed, double check that you have the right link");
    navigate("/app/login");
  }

  useEffect(() => {
    request("POST", "/verifyPasswordResetToken", {
      utoken: searchParams.utoken,
    })
      .then((res) => {
        console.log('res: ', res);
        setEmail(res.email)
        // tryAgainUser()
        // navigate("/french/pronunciation-course");
      })
      .catch((err) => {
        setVerifyError(true);
        Sentry.captureException(new Error("verify token error"), {
          extra: {
            searchParams,
            response: err?.response,
          },
        });
        // tryAgainUser()
        // navigate("/french/pronunciation-course");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [msg, setMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    const email = formRef.current.email.value;
    const password = formRef.current.password.value;
    const passwordTwo = formRef.current.passwordTwo.value;
    const utoken = formRef.current.utoken.value;

    if (password != passwordTwo) {
      alert("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      alert("Choose a password with at least 6 letters");
      return;
    }

    console.log("email: ", email);
    request("POST", "/setPassword", {
      email,
      password,
      token: utoken,
    })
      .then((user) => {
        tryAgainUser();
        navigate("/app/login");
      })
      .catch(async (asdf) => {
        Sentry.captureException(new Error("wrong token"), {
          extra: {
            section: "articles",
            utoken,
            passwordTwo,
            password,
            email,
            response: asdf?.response,
          },
        });
        const response = await asdf?.response?.json?.();
        if (response?.message == "email not found") {
          alert("Email not found in database...");
          return;
        }
        if (response?.message == "wrong token") {
          alert("The token is wrong or outdated...");
          return;
        }

        alert("Some error...");
      });
    // signupUser(email, password)
    //   .catch((err) => setMsg("Error: " + err.message));
  };

  return (
    <LoginLayout>
      {loading ? (
        <>Loading...</>
      ) : verifyError ? (
        <>
          <div>
            <p className="py-3">We couldn't verify the link. Maybe the link is malformed.</p>
            <p className="py-3">
              Please    <Link to="/app/forgot-password" className="underline text-blue-500">request a new link</Link>{" "}
            </p>
            <p className="py-3">
              You can also try to{" "}
              <Link className="underline text-blue-500" to="/app/login">
                log in
              </Link>
              .
            </p>
          </div>
        </>
      ) : (
        <>
          <form ref={formRef} onSubmit={onSubmit}>
            <div className="font-medium mb-4">Setting password</div>
            <input type="hidden" name={"utoken"} value={searchParams.utoken} />

            <FormElement
              title={"Email address"}
              type="email"
              name="email"
              placeholder="you@email.com"
              value={email}
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
        </>
      )}
    </LoginLayout>
  );
}
