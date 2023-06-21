import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { GameContextProvider } from "./context/GameContext";
import Associations from "./pages/Associations";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import LongestWord from "./pages/LongestWord";
import MainMenu from "./pages/MainMenu";
import Mastermind from "./pages/Mastermind";
import MatchingPairs from "./pages/MatchingPairs";
import Quiz from "./pages/Quiz";
import SinglePlayer from "./pages/SinglePlayer";
import TargetNumber from "./pages/TargetNumber";
import TwoPlayers from "./pages/TwoPlayers";
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {
  return (
    <GameContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<MainMenu />} />
          <Route path="/multiplayer" element={<TwoPlayers />} />
          <Route path="/singlePlayer" element={<SinglePlayer />} />
          <Route path="/longestWord" element={<LongestWord />} />
          <Route path="/targetNumber" element={<TargetNumber />} />
          <Route path="/matchingPairs" element={<MatchingPairs />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/mastermind" element={<Mastermind />} />
          <Route path="/associations" element={<Associations />} />
        </Routes>
      </BrowserRouter>
    </GameContextProvider>
  );
}

export default App;
