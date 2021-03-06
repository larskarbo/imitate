import React, { useEffect, useRef, useState } from "react";

import { Link, navigate } from "gatsby";
import { request } from "../utils/request";
import { FormElement } from "./FormElement";
import { SubmitButton } from "./SubmitButton";
import LoginLayout from "./LoginLayout";
import { useUser } from "../../user-context";
import { BASEPATH } from '../../pages/french/pronunciation-course';

export default function LoginPage() {
  const {tryAgainUser } = useUser()
  const formRef = useRef();
  const [msg, setMsg] = useState("");

  const onLogin = (e) => {
    e.preventDefault();

    const email = formRef.current.email.value;
    const password = formRef.current.password.value;

    request("POST", "/login", {
      email,
      password,
    })
      .then((res) => {
        tryAgainUser()
        navigate("/french/pronunciation-course");
      })
      .catch((error) => {
        if (error.message == "Unauthorized") {
          setMsg("Wrong username or password, please try again.");
        } else {
          setMsg(error.message);
        }
      });
  };

  return (
    <LoginLayout msg={msg}>
      <div className="pb-4 text-xs text-gray-700 font-light">You need to buy the <Link to={BASEPATH}>French Pronunciation Basic</Link> course to get an account.</div>
      <form ref={formRef} onSubmit={onLogin}>
        <FormElement title={"Email address"} type="email" name="email" placeholder="you@email.com" />

        <FormElement title={"Password"} type="password" name="password" placeholder="*******" />

        <SubmitButton>Log in</SubmitButton>
      </form>
    </LoginLayout>
  );
}
