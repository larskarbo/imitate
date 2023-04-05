import Link from "next/link";
import { useRouter } from "next/router";
import { parse } from "query-string";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../user-context";
import { request } from "../../application/utils/request";
import { FormElement } from "../../application/Login/FormElement";
import LoginLayout from "../../application/Login/LoginLayout";
import { SubmitButton } from "../../application/Login/SubmitButton";

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
  const router = useRouter();

  const searchParams = router.query;
  useEffect(() => {
    () => {
      if (!searchParams.utoken) {
        alert("Link is malformed, double check that you have the right link");
        router.push("/app/login");
      }
    };
  });

  useEffect(() => {
    request("POST", "/verifyPasswordResetToken", {
      utoken: searchParams.utoken,
    })
      .then((res) => {
        console.log("res: ", res);
        setEmail(res.email);
        // tryAgainUser()
        // navigate("/french/pronunciation-course");
      })
      .catch((err) => {
        setVerifyError(true);
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

    //@ts-ignore
    const email = formRef.current.email.value;
    //@ts-ignore
    const password = formRef.current.password.value;
    //@ts-ignore
    const passwordTwo = formRef.current.passwordTwo.value;
    //@ts-ignore
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
        router.push("/app/login");
      })
      .catch(async (asdf) => {
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
            <p className="py-3">
              We couldn't verify the link. Maybe the link is malformed.
            </p>
            <p className="py-3">
              Please{" "}
              <Link href="/app/forgot-password" className="underline text-blue-500">
                request a new link
              </Link>{" "}
            </p>
            <p className="py-3">
              You can also try to{" "}
              <Link href="/app/login" className="underline text-blue-500">
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
