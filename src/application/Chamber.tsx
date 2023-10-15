import { range } from "lodash";
import { useState } from "react";
import { Region } from "./PlaybackBoat";

import { atom, useAtom } from "jotai";
import { ItemBox } from "./ItemBox";
import { SheetPicker } from "./SheetPicker";

export function Chamber({ namespace }: { namespace: string }) {
  const [recordCount, setRecordCount] = useAtom(recordingCountAtom);

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen w-full">
      <SheetPicker />
      <div className="max-w-3xl flex flex-col items-center px-8 w-full pb-24">
        <div className="pb-8"></div>
      </div>
      Recordings: {recordCount}
      <div className="w-full px-2 grid grid-cols-4 gap-3 overflow-x-auto">
        {range(40).map((i) => {
          return <ItemBox key={i} id={i} sheetNamespace={namespace} />;
        })}
      </div>
    </div>
  );
}

export const recordingCountAtom = atom(0);

export const lastRegionAtom = atom(
  null as {
    region: Region;
    blobUrl: string;
		isRecording: boolean;
  } | null
);

export const focusedItemAtom = atom(null as number | null);

import { useDrag } from 'react-dnd'
