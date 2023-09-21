export const blobToAudioBuffer = async (blob: Blob): Promise<AudioBuffer> => {
  const arrayBuffer = await blobToArrayBuffer(blob);

  const audioContext = new AudioContext();
  const audiobuffer = await new Promise<AudioBuffer>((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer, resolve, reject);
  });

  return audiobuffer;
};

export const blobToArrayBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
  const fileReader = new FileReader();
  const arrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
    fileReader.onloadend = () => {
      resolve(fileReader.result as ArrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
  });

  return arrayBuffer;
};
