import toWav from "audiobuffer-to-wav";


export async function audioBufferToBlob(audioBuffer: AudioBuffer): Promise<Blob> {
  const wavData = toWav(audioBuffer);
  const blob = new Blob([new DataView(wavData)], { type: "audio/wav" });
  return blob;
}
