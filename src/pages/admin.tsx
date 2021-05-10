import React, { useContext, useEffect, useState } from "react";

import { Router } from "@reach/router";
import Main from "../app/Main";
import LoginPage from "../app/Login/LoginPage";
import { useUser } from "../user-context";
import SetPasswordPage from "../app/Login/SetPasswordPage";
import { Header } from "../course/Header";
import ForgotPasswordPage from "../app/Login/ForgotPasswordPage";
import { request } from "../app/utils/request";
import content from "../course/content.json"

const url = "https://slapper.io";

export default function Admin() {
  const [data, setData] = useState(null);
  const [max, setMax] = useState(0);
  

  useEffect(() => {
    request("GET", "/getAdminData").then((asdf) => {
      console.log({ asdf });
      const num = content.reduce((acc, val) => {
        if(val.children){
          return acc + val.children.length
        }
        return acc + 1
      },0)
      setMax(num)
      setData(asdf)
    });
  }, []);

  const { user } = useUser();

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen w-full">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email ({data.users.length})
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email verified
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Progress ({max})
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.users.map((user) => (
                    <tr key={user.email}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email_verified ? "(not verified)" : ""}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.progressArr.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* This example requires Tailwind CSS v2.0+ */
const people = [
  { name: "Jane Cooper", title: "Regional Paradigm Technician", role: "Admin", email: "jane.cooper@example.com" },
  // More people...
];
