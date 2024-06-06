"use client";

import { AuthContext } from "@/providers/AuthProvider";
import { parseJwt } from "@/lib/parseJwt";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const { token } = useContext(AuthContext);

  return (
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
  );
}
