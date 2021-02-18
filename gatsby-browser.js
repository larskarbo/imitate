import "./src/tailwind.css";
import "./src/styles.css";
import { UserProvider } from "./src/user-context";
import React from 'react';

// Wraps every page in a component
export const wrapPageElement = ({ element, props }) => {
  return <UserProvider {...props}>{element}</UserProvider>;
};