export const trimSilence = async (
  buffer: AudioBuffer
) => {
  const offlineContext = new OfflineAudioContext(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineContext.destination);

  source.start(0);
  const renderedBuffer = await offlineContext.startRendering();

  let startOffset = 0;
  let endOffset = renderedBuffer.length - 1;
  const data = renderedBuffer.getChannelData(0);

  const THRESHOLD = 0.1;
  const START_PAD = 10_000;
  const END_PAD = 30_000;

  // Find first non silent sample
  while (data[startOffset] < THRESHOLD) {
    startOffset++;
  }

  startOffset = Math.max(0, startOffset - START_PAD);

  // Find last non silent sample
  while (data[endOffset] < THRESHOLD) {
    endOffset--;
  }

  endOffset = Math.min(endOffset + END_PAD, renderedBuffer.length - 1);

  console.log("startOffset: ", startOffset);
  console.log("endOffset: ", endOffset);

  if (endOffset < startOffset) {
    return null;
  }

  // Create new trimmed AudioBuffer
  const newBuffer = source.context.createBuffer(
    renderedBuffer.numberOfChannels,
    endOffset - startOffset,
    renderedBuffer.sampleRate
  );

  // Fill the channels of the new AudioBuffer with the trimmed data
  for (let channel = 0; channel < renderedBuffer.numberOfChannels; channel++) {
    const channelData = renderedBuffer.getChannelData(channel);
    newBuffer.copyToChannel(
      channelData.subarray(startOffset, endOffset),
      channel
    );
  }

  return newBuffer;
};
