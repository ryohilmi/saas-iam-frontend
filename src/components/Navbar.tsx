"use client";

import { AuthContext } from "@/providers/AuthProvider";
import { useContext } from "react";

const Navbar: React.FC = () => {
  const { token, login, logout } = useContext(AuthContext);

  return (
    <nav className="flex justify-between px-6 py-4">
      <h1>Home</h1>

      <div className="flex">
        {token ? (
          <button className="bg-red-600 px-5 py-1 rounded-md" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="bg-blue-600 px-5 py-1 rounded-md" onClick={login}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
