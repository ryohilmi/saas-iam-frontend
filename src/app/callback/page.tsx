"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { useEffect } from "react";

export default function Home() {
  const [isLoggingIn, setIsLoggingIn] = React.useState({
    state: false,
    error: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && state) {
      try {
        setIsLoggingIn({ error: false, state: true });

        fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, state }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              setIsLoggingIn({ state: false, error: true });
              throw new Error("Login failed");
            }
          })
          .then((data) => {
            localStorage.setItem("token", data.token);
            window.location.href = "/";
          });
      } catch (error) {
        setIsLoggingIn({ state: false, error: true });
        console.error("ngok", error);
      }
    }
  }, []);

  return (
    <main className="z-20 bg-white w-full h-screen fixed top-0 left-0 flex justify-center items-center">
      {isLoggingIn.error && (
        <div className="flex flex-col gap-6">
          <p className="text-3xl relative -top-4">Login failed:(</p>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Back
          </Button>
        </div>
      )}

      {isLoggingIn.state && (
        <p className="text-3xl relative -top-4">Loading...</p>
      )}
    </main>
  );
}
