export const blobToAudioBuffer = async (blob: Blob) => {
  const audioContext = new AudioContext();
  const fileReader = new FileReader();

  const audiobuffer = await new Promise<AudioBuffer>((resolve) => {
    // Set up file reader on loaded end event
    fileReader.onloadend = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;

      // Convert array buffer into audio buffer
      audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
        resolve(audioBuffer);
      });
    };

    //Load blob
    fileReader.readAsArrayBuffer(blob);
  });
  return audiobuffer;
};
