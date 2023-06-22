import axios from "axios";
import React, { createContext, useEffect, useState, useRef } from "react";

interface AuthContextProps {
  loggedUserInfo: UserInfo;
  setLoggedUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserInfo {
  userId: number;
  userName: string;
  email: string;
  image: string;
}

export const AuthContext = createContext<AuthContextProps>({
  loggedUserInfo: {
    userId: 0,
    userName: "",
    email: "",
    image: "",
  },
  setLoggedUserInfo: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const AuthContextProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserInfo, setLoggedUserInfo] = useState<UserInfo>({
    userId: 0,
    userName: "",
    email: "",
    image: "",
  });

  return (
    <AuthContext.Provider
      value={{ loggedUserInfo, setLoggedUserInfo, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
