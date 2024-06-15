"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function notFound() {
  return (
    <main className="z-20 bg-white w-full h-screen fixed top-0 left-0 flex justify-center items-center">
      <div className="flex flex-col gap-6 items-center">
        <Image src="/404.png" alt="404" width={600} height={400} />

        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    </main>
  );
}
