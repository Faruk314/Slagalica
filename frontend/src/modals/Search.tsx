import axios from "axios";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { UserInfo } from "../context/AuthContext";

interface Props {
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = ({ setOpenSearch }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<UserInfo[]>([]);
  const [clicked, setClicked] = useState(false);

  const searchHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:4000/api/game/searchPlayers?search=${searchTerm}`
      );

      setPlayers(response.data);
      setClicked(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgb(0,0,0,0.7)]">
      <div className="relative flex flex-col items-center space-y-2 p-4 text-gray-500 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md bg-white">
        <button
          onClick={() => setOpenSearch(false)}
          className="absolute top-[-0.5rem] text-white bg-blue-600 rounded-full right-[-0.5rem] text-xl py-1 px-3 hover:bg-blue-500"
        >
          X
        </button>
        <h3 className="text-2xl">Search players</h3>
        <form
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              searchHandler(e);
            }
          }}
          onSubmit={searchHandler}
          className="flex items-center"
        >
          <button
            type="submit"
            className="h-[2.4rem] px-2 text-white bg-blue-600 border-black rounded-l-xl"
          >
            <AiOutlineSearch size={25} />
          </button>
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-[0.4rem] border border-black focus:outline-blue-600 rounded-r-xl px-1"
            placeholder="Search by username or id"
          />
        </form>

        <div className="flex flex-col w-full space-y-2 overflow-auto max-h-[15rem] py-5 px-2">
          {clicked && players.length === 0 && (
            <p className="text-center text-blue-600">No players found</p>
          )}
          {players.map((player) => (
            <div
              key={player.userId}
              className="flex items-center justify-between rounded-lg  shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            >
              <div className="flex items-center space-x-2">
                <div className="p-2 border-r rounded-l-md">
                  <img
                    src="/images/skocko.png"
                    alt=""
                    className="rounded-md w-[2rem]"
                  />
                </div>
                <div>
                  <span className="text-xl">{player.userName}</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-[0.8rem]">playerID</span>
                    <span>{player.userId}</span>
                  </div>
                </div>
              </div>

              <button className="px-2 py-1 text-[0.9rem] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500 mr-2">
                INVITE
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
