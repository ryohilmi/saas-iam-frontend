"use client";

import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

type Props = {
  children?: React.ReactNode;
};
const AuthProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = () => {
    fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/login`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          window.location.href = data.url;
        }
      });
  };

  const logout = () => {
    fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/logout`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.removeItem("token");
        setToken(null);
        window.location.href = data.url;
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
