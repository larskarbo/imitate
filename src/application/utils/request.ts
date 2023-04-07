import axios from "axios";

const isLocal = (typeof location != "undefined") && location?.host?.includes("localhost")
export const BASE = isLocal ? `http://localhost:3200` : `https://server.imita.io`


let headers = {};

export function request(method, functionName, data?) {
  return axios({
    url: BASE + functionName,
    method: method,
    data: data,
    withCredentials: true,
  }).then(res => res.data)
}
