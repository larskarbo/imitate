import React from "react";
import { FaCheck } from "react-icons/fa";
import { celebrate } from "./utils/celebrate";
import { useProgress } from "./progress-context";

export const SelfAssessment = ({ id, type = "sound" }: { id: string; type?: "sound" | "article"; }) => {
  const { getProgress, setProgress } = useProgress();
  const progressHere = getProgress(id);

  return (
    <div>
      <div className="smallcase pb-2">Self assessment:</div>
      <div className="flex flex-col">
        <div className="flex items-center mb-2">
          <button
            onClick={() => setProgress(id, 20)}
            className="w-12 h-12 rounded mr-2 border border-gray-400 flex justify-center items-center bg-yellow-100"
          >
            {progressHere == 20 && <FaCheck size={24} className="text-yellow-700" />}
          </button>
          <div className="mr-2 text-sm text-gray-800 font-light">
            {type == "sound" ? "Just starting." : "Need to come back."}
          </div>
        </div>
        <div className="flex items-center mb-2">
          <button
            onClick={() => setProgress(id, 40)}
            className="w-12 h-12 rounded mr-2 border border-gray-400 flex justify-center items-center bg-yellow-200"
          >
            {progressHere == 40 && <FaCheck size={24} className="text-yellow-700" />}
          </button>
          <div className="mr-2 text-sm text-gray-800 font-light">
            {type == "sound" ? "Almost there." : "Almost there."}
          </div>
        </div>
        <div className="flex items-center mb-2">
          <button
            onClick={() => {
              if (progressHere != 100) {
                setProgress(id, 100, celebrate);
              }
            }}
            className="w-12 h-12 rounded mr-2 border border-gray-400 flex justify-center items-center bg-green-300"
          >
            {progressHere == 100 && <FaCheck size={24} className="text-white" />}
          </button>
          <div className="mr-2 text-sm text-gray-800 font-light">
            {type == "sound" ? "Perfect." : "Read/watched and understood."}
          </div>
        </div>
      </div>
    </div>
  );
};
