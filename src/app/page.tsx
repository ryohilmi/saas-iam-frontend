"use client";

import { parseJwt } from "@/utils/parseJwt";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

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
    fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/login`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.removeItem("token");
        setToken(null);
        window.location.href = data.url;
      });
  };

  return (
    <main>
      <nav className="flex justify-between px-6 py-4">
        <h1>Home</h1>

        <div className="flex">
          {token ? (
            <button
              className="bg-red-600 px-5 py-1 rounded-md"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-blue-600 px-5 py-1 rounded-md"
              onClick={login}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <section className="px-6 w-full mx-auto">
        <table>
          <tbody>
            {token &&
              Object.entries(parseJwt(token)).map(([key, value], i) => (
                <tr key={i}>
                  <td>{key}</td>
                  <td>{value as string}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
      <br />
    </main>
  );
}
