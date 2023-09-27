import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
//@ts-ignore
import Regions from "wavesurfer.js/plugins/regions";

type WaveSurferOptions = Partial<WaveSurfer["options"]>;

export type Region = {
  start: number;
  end: number;
};

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
      <div ref={containerRef} style={{ minHeight: "120px" }} />
    </>
  );
};

export default function PlaybackBoat({
  blobUrl,
  onSetWavesurfer,
  onRegionUpdate,
}: {
  blobUrl: string;
  onSetWavesurfer: (ws: WaveSurfer) => void;
  onRegionUpdate: (region: Region | null) => void;
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
        onRegionUpdate={onRegionUpdate}
      />
    </div>
  );
}
