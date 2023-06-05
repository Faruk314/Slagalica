import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Skocko from "./pages/Skocko";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/skocko" element={<Skocko />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
