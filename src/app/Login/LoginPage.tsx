import React, { useEffect, useRef, useState } from "react";

import { navigate } from "gatsby";
import { request } from "../utils/request";
import { FormElement } from "./FormElement";
import { SubmitButton } from "./SubmitButton";
import LoginLayout from "./LoginLayout";
import { useUser } from "../../user-context";

export default function LoginPage() {
  const {tryAgainUser } = useUser()
  const formRef = useRef();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    request("GET", "/users").then((asdf) => {
      console.log("asdf: ", asdf);
    });
  }, []);

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
      <form ref={formRef} onSubmit={onLogin}>
        <FormElement title={"Email address"} type="email" name="email" placeholder="you@email.com" />

        <FormElement title={"Password"} type="password" name="password" placeholder="*******" />

        <SubmitButton>Log in</SubmitButton>
      </form>
    </LoginLayout>
  );
}
