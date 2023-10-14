import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
//@ts-ignore
import Regions from "wavesurfer.js/plugins/regions";

type WaveSurferOptions = Partial<WaveSurfer["options"]>;

export type Region = {
  start: number;
  end: number;
};

export const ITEMBOX_HEIGHT = 160;

const useWavesurfer = (
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  options: WaveSurferOptions,
  onRegionUpdate: (region: Region | null) => void
) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
      height: ITEMBOX_HEIGHT,
			cursorColor: "gray"
    });

    // Initialize the Regions plugin
    const wsRegions = ws.registerPlugin(Regions.create());

    wsRegions.enableDragSelection({
      color: "rgba(255, 0, 0, 0.1)",
    });

    let oldRegion: any = null;
    wsRegions.on("region-created", (region) => {
      if (oldRegion) {
        oldRegion.remove();
        oldRegion = null;
      }

      oldRegion = region;
      onRegionUpdate(region);
    });

    wsRegions.on("region-updated", (region) => {
      onRegionUpdate(region);
    });

    setWavesurfer(ws);

    ws.on("seeking", (e) => {
      if (oldRegion) {
        oldRegion.remove();
        oldRegion = null;
      }

      onRegionUpdate(null);
    });

    return () => {
      ws.destroy();
    };
  }, [options.url, containerRef]);

  return wavesurfer;
};

const WaveSurferPlayer = ({
  options,
  onSetWavesurfer,
  onRegionUpdate,
}: {
  options: WaveSurferOptions;
  onSetWavesurfer: (ws: WaveSurfer) => void;
  onRegionUpdate: (region: Region | null) => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useWavesurfer(containerRef, options, onRegionUpdate);

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!wavesurfer) return;

    setCurrentTime(0);

    const subscriptions = [
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
      <div ref={containerRef} style={{ height: "100%" }} />
    </>
  );
};

export default function PlaybackBoat({
  blobUrl,
  isRecording,
  onSetWavesurfer,
  onRegionUpdate,
}: {
  blobUrl: string;
  isRecording: boolean;
  onSetWavesurfer: (ws: WaveSurfer) => void;
  onRegionUpdate: (region: Region | null) => void;
}) {
  const options: WaveSurferOptions = {
    waveColor: isRecording ? "#CC3110" : "#4F4A85",
    progressColor: isRecording ? "#7A210E" : "#383351",
  };

  return (
    <div className="flex flex-col w-full absolute inset-0">
      <WaveSurferPlayer
        options={{
          ...options,
          url: blobUrl,
        }}
        onSetWavesurfer={onSetWavesurfer}
        onRegionUpdate={onRegionUpdate}
      />
    </div>
  );
}
