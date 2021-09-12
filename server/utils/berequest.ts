import axios from "axios";
import { getErrorMessage } from "./getErrorMessage";

require("dotenv").config();
export let isNode;

try {
  isNode = typeof window == "undefined";
} catch (e) {
  isNode = true;
}

export const isLocal = () => {
  if (isNode) {
    return process.env.NODE_ENV == "development";
  }
  return typeof location != "undefined" && location?.host?.includes("localhost");
};

console.log("IS LOCAL: ", isLocal());

// export const BASE = ``
export const WEB_BASE = isLocal() ? `http://localhost:3000` : `https://goimitate.ai`;
export const BASE = isLocal() ? `http://localhost:3200` : `https://server.goimitate.ai`;
console.log("BASE: ", BASE);

export function berequest(method, functionName, data?) {
  return axios({
    url: BASE + functionName,
    method: method,
    data: data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw getErrorMessage(err);
    });
}

export function requestNextApi(method, functionName, data?) {
  return axios({
    url: functionName,
    method: method,
    data: data,
  }).then((res) => res.data);
}
