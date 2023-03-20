import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { BASEPATH } from "../french/pronunciation-course";
import { useUser } from "../../user-context";
import { getErrorMessage } from "get-error-message";
import { request } from "../../application/utils/request";
import { FormElement } from "../../application/Login/FormElement";
import LoginLayout from "../../application/Login/LoginLayout";
import { SubmitButton } from "../../application/Login/SubmitButton";

export default function LoginPage() {
  const { tryAgainUser } = useUser();
  const formRef = useRef();
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const onLogin = (e) => {
    e.preventDefault();

    //@ts-ignore
    const email = formRef.current.email.value;
    //@ts-ignore
    const password = formRef.current.password.value;

    request("POST", "/login", {
      email,
      password,
    })
      .then((res) => {
        tryAgainUser();
        router.push("/french/pronunciation-course");
      })
      .catch((error) => {
        console.log("error: ", error);
        if (error.message == "Unauthorized") {
          setMsg("Wrong username or password, please try again.");
        } else {
          setMsg(getErrorMessage(error));
        }
      });
  };

  return (
    <LoginLayout msg={msg}>
      <div className="pb-4 text-xs text-gray-700 font-light">
        You need to buy the{" "}
        <Link href={BASEPATH}>French Pronunciation Basic</Link> course to get an
        account.
      </div>
      <form ref={formRef} onSubmit={onLogin}>
        <FormElement
          title={"Email address"}
          type="email"
          name="email"
          placeholder="you@email.com"
        />

        <FormElement
          title={"Password"}
          type="password"
          name="password"
          placeholder="*******"
        />

        <SubmitButton>Log in</SubmitButton>

        <Link href="/app/forgot-password">
          <a className="text-sm">Forgot password?</a>
        </Link>
      </form>
    </LoginLayout>
  );
}
