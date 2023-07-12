import axios from "axios";
import React, { useContext, useState } from "react";
import { FaPuzzlePiece } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("farukspahictz@gmail.com");
  const [password, setPassword] = useState("ispitivac");
  const [userName, setUsername] = useState("faruk");
  const [message, setMessage] = useState("");
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      setMessage("All fields must be filled");
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/auth/register`, {
        userName,
        email,
        password,
      });
      setIsLoggedIn(true);
      navigate("/menu");
    } catch (error: any) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <section className="flex flex-col space-y-10 items-center justify-center h-[100vh]">
      <div className="flex items-center space-x-1 text-4xl font-bold">
        <FaPuzzlePiece size={70} className="text-blue-600" />
        <h1 className="text-gray-500">GAME</h1>
      </div>
      <form
        onSubmit={registerHandler}
        className="flex flex-col p-4 text-gray-500 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md "
      >
        <label className="text-blue-600">Username</label>
        <input
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          className="p-1 bg-transparent border-b rounded-sm shadow-sm focus:outline-none"
        />
        <label className="mt-5 text-blue-600">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="p-1 bg-transparent border-b rounded-md shadow-sm focus:outline-none"
        />
        <label className="mt-5 text-blue-600">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="p-1 bg-transparent border-b rounded-md shadow-sm focus:outline-none"
        />

        <button
          type="submit"
          className="px-2 py-2 mt-5 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-500"
        >
          REGISTER
        </button>

        <Link to="/" className="mt-5 text-center text-gray-400">
          already have an account?
        </Link>
      </form>

      {message && <p className="text-red-500">{message}</p>}
    </section>
  );
};

export default Register;
