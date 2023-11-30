export const audioBufferIncreaseGain = (
  audioBuffer: AudioBuffer,
  gain: number
) => {
  const audioContext = new AudioContext();
  const newBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  let outOfBoundsOccured = 0;

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelDataOriginal = audioBuffer.getChannelData(channel);
    const channelDataNew = newBuffer.getChannelData(channel);

    for (let i = 0; i < audioBuffer.length; i++) {
      channelDataNew[i] = channelDataOriginal[i] * gain;

      // Adding a check for bounds after gain is applied.
      if (channelDataNew[i] > 1 || channelDataNew[i] < -1) {
        outOfBoundsOccured++;
      }
    }
  }

  if (outOfBoundsOccured > 1000) {
    return audioBuffer;
  }

  return newBuffer;
};
