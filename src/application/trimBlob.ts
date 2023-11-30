import { audioBufferToBlob } from "./audioBufferToBlob";
import { blobToAudioBuffer } from "./blobToAudioBuffer";

export const trimBlob = async (blob: Blob, from: number, to: number) => {
  // First convert the blob to an AudioBuffer
  const audioBuffer = await blobToAudioBuffer(blob);

  // Then create a new empty buffer with the length of the trim duration and same number of channels
  const audioContext = new AudioContext();
  const trimLength = Math.floor((to - from) * audioBuffer.sampleRate); // in samples
  const fromSamples = Math.round(from * audioBuffer.sampleRate);

  const trimmedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    trimLength,
    audioBuffer.sampleRate
  );

  // Iterate each channel of original AudioBuffer, copy subsection into the corresponding channel of new buffer
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelDataOriginal = audioBuffer.getChannelData(channel);
    const channelDataTrimmed = trimmedBuffer.getChannelData(channel);

    for (let i = 0; i < trimLength; i++) {
      channelDataTrimmed[i] = channelDataOriginal[fromSamples + i];
    }
  }

  return await audioBufferToBlob(trimmedBuffer);
};


