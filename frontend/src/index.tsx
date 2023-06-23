import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GameContextProvider } from "./context/GameContext";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <GameContextProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </GameContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
