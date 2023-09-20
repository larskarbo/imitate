import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type WaveSurferOptions = Partial<WaveSurfer["options"]>;

const useWavesurfer = (
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  options: WaveSurferOptions
) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options.url, containerRef]);

  return wavesurfer;
};

const WaveSurferPlayer = ({
  options,
  onSetWavesurfer,
}: {
  options: WaveSurferOptions;
  onSetWavesurfer: (ws: WaveSurfer) => void;
}) => {
  const containerRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const wavesurfer = useWavesurfer(containerRef, options);

  useEffect(() => {
    if (!wavesurfer) return;

    setCurrentTime(0);
    // setIsPlaying(false);

    const subscriptions = [
      // wavesurfer.on("play", () => setIsPlaying(true)),
      // wavesurfer.on("pause", () => setIsPlaying(false)),
      wavesurfer.on("timeupdate", (currentTime) => setCurrentTime(currentTime)),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  useEffect(() => {
    if (!wavesurfer) return;

    onSetWavesurfer(wavesurfer);
  }, [wavesurfer]);

  return (
    <>
      <div ref={containerRef} style={{ minHeight: "120px" }} />

      <p>Seconds played: {currentTime}</p>
    </>
  );
};

export default function PlaybackBoat({
  blobUrl,
  onSetWavesurfer,
}: {
  blobUrl: string;
  onSetWavesurfer: (ws: WaveSurfer) => void;
}) {
  const options: WaveSurferOptions = {
    waveColor: "#4F4A85",
    progressColor: "#383351",
  };

  return (
    <div className="flex flex-col w-full">
      <WaveSurferPlayer
        options={{
          ...options,
          url: blobUrl,
        }}
        onSetWavesurfer={onSetWavesurfer}
      />
    </div>
  );
}
