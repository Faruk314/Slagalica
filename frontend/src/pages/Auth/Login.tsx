import React from "react";
import { FaPuzzlePiece } from "react-icons/fa";

const Login = () => {
  return (
    <section className="flex flex-col space-y-10 items-center justify-center h-[100vh]">
      <div className="flex items-center space-x-1 text-4xl font-bold">
        <FaPuzzlePiece size={70} className="text-blue-600" />
        <h1 className="text-gray-500">GAME</h1>
      </div>
      <div className="flex flex-col p-4 text-gray-500 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md ">
        <label className="text-blue-600">Username</label>
        <input
          type="text"
          className="p-1 bg-transparent border-b rounded-sm shadow-sm focus:outline-none"
        />
        <label className="mt-5 text-blue-600">Email</label>
        <input
          type="email"
          className="p-1 bg-transparent border-b rounded-md shadow-sm focus:outline-none"
        />
        <label className="mt-5 text-blue-600">Password</label>
        <input
          type="password"
          className="p-1 bg-transparent border-b rounded-md shadow-sm focus:outline-none"
        />

        <button className="px-2 py-2 mt-5 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500">
          LOGIN
        </button>
      </div>
    </section>
  );
};

export default Login;
