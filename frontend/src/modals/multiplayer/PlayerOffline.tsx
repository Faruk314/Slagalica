import React from "react";

interface Props {
  setOpenPlayerOfflineModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerOffline = ({ setOpenPlayerOfflineModal }: Props) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-30 flex flex-col items-center justify-center px-5 py-5 space-y-2 bg-white rounded-md shadow-xl">
        <p className="text-gray-600">This player is currently offline</p>

        <button
          onClick={() => {
            setOpenPlayerOfflineModal(false);
          }}
          className="px-4 py-1 text-[0.9rem] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PlayerOffline;
