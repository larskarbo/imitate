
import axios from "axios";
import { getEnv } from "./getEnv";

export const slackNotify = async (text: string, obj?: any) => {
  let textToSend = text;
  if (obj) {
    textToSend += "\n";
    textToSend += "```";
    textToSend += JSON.stringify(obj, null, 2);
    textToSend += "```";
  }

  axios.post(getEnv("SLACK_WEBHOOK_URL"), {
    text: textToSend,
  });
};
