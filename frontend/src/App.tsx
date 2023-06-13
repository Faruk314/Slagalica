import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Asocijacije from "./pages/Asocijacije";
import MojBroj from "./pages/MojBroj";
import Quiz from "./pages/Quiz";
import Skocko from "./pages/Skocko";
import Slagalica from "./pages/Slagalica";
import Spojnice from "./pages/Spojnice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/skocko" element={<Skocko />} />
        <Route path="/asocijacije" element={<Asocijacije />} />
        <Route path="/mojbroj" element={<MojBroj />} />
        <Route path="/spojnice" element={<Spojnice />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/slagalica" element={<Slagalica />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
