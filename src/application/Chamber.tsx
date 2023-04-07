import { useState } from "react";
import { Header } from "../course/Header";
import RecordBoat from "./RecordBoat";

export function Chamber({ segmentId = null }) {
  const [recordings, setRecordings] = useState([]);

  const [recording, setRecording] = useState(false);

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen w-full">
      <Header />
      <div className="max-w-3xl flex flex-col items-center px-8 w-full pb-24">
        <div className="pb-8"></div>

        <RecordBoat
          onRecordFinish={(blobUrl) => {
            setRecordings([{ blobUrl }, ...recordings]);
          }}
          onRecordingChange={setRecording}
        />
      </div>
    </div>
  );
}
