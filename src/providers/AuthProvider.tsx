"use client";

import { parseJwt } from "@/lib/parseJwt";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

type UserInfo = {
  sub: string;
  name: string;
  email: string;
  picture: string;
};

type AuthContextType = {
  token: string | null;
  login: () => void;
  logout: () => void;
  userInfo: UserInfo | null;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  userInfo: null,
});

type Props = {
  children?: React.ReactNode;
};
const AuthProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const pathname = usePathname();

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
    if (pathname === "/callback") return;

    const token = localStorage.getItem("token");

    if (token) {
      setToken(token);

      const { sub, name, email, picture } = parseJwt(token);
      setUserInfo({ sub, name, email, picture });
    } else {
      login();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, token, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
