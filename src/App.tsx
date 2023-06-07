import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Asocijacije from "./pages/Asocijacije";
import Skocko from "./pages/Skocko";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/skocko" element={<Skocko />} />
        <Route path="/asocijacije" element={<Asocijacije />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
