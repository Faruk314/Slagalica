import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Asocijacije from "./pages/Asocijacije";
import MojBroj from "./pages/MojBroj";
import Skocko from "./pages/Skocko";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/skocko" element={<Skocko />} />
        <Route path="/asocijacije" element={<Asocijacije />} />
        <Route path="/mojbroj" element={<MojBroj />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
