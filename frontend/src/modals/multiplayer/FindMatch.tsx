import React, { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";

interface Props {
  setOpenFindMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindMatch = ({ setOpenFindMatch }: Props) => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket?.emit("findMatch");
  }, [socket]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="flex flex-col items-center justify-center p-4 px-10 mx-2 space-y-4 text-black bg-white rounded-md">
        <h2 className="text-xl">Looking for match</h2>

        <div className="loader"></div>

        <button
          onClick={() => {
            socket?.emit("cancelFindMatch");
            setOpenFindMatch(false);
          }}
          className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FindMatch;
