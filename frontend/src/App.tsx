import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Associations from "./pages/Associations";
import LongestWord from "./pages/LongestWord";
import Mastermind from "./pages/Mastermind";
import MatchingPairs from "./pages/MatchingPairs";
import Quiz from "./pages/Quiz";
import SinglePlayer from "./pages/SinglePlayer";
import TargetNumber from "./pages/TargetNumber";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/singlePlayer" element={<SinglePlayer />} />
        <Route path="/longestWord" element={<LongestWord />} />
        <Route path="/targetNumber" element={<TargetNumber />} />
        <Route path="/matchingPairs" element={<MatchingPairs />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/mastermind" element={<Mastermind />} />
        <Route path="/associations" element={<Associations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
