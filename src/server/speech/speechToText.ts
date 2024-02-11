import FormData from "form-data";
import fetch from "node-fetch";
import {getEnv} from "@larskarbo/get-env";

const openaiApiKey = getEnv("OPENAI_API_KEY");
const openaiEndpoint = "https://api.openai.com/v1/audio/transcriptions";
const model = "whisper-1";

export async function speechToText(file: Uint8Array, prompt: string) {
  const formData = new FormData();
  console.log("transcribing audio...");

  formData.append("model", model);
  formData.append("file", file, "file.wav");
  formData.append("prompt", prompt);
  formData.append("language", "fr");
  formData.append("response_format", "verbose_json");

  const response = await fetch(openaiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    await response.json().then((json) => console.log(json));
    throw new Error(
      `Failed to transcribe audio. Status code: ${response.status}`
    );
  }

  const transcription = (await response.json()) as {
    text: string;
  };
  console.log("transcription: ", transcription);

  return transcription.text;
}
