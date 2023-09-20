export const blobToAudioBuffer = async (blob: Blob): Promise<AudioBuffer> => {
  const fileReader = new FileReader();
  const arrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
    fileReader.onloadend = () => {
      resolve(fileReader.result as ArrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
  });

  const audioContext = new AudioContext();
  const audiobuffer = await new Promise<AudioBuffer>((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer, resolve, reject);
  });

  return audiobuffer;
};
