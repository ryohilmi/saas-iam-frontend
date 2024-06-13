import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/providers/AuthProvider";
import AuthProvider from "@/providers/AuthProvider";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import OrganizationProvider from "@/providers/OrganizationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Management",
  description: "SaaS User Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <OrganizationProvider>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
              <Sidebar />
              <div className="flex flex-col">
                <Header />

                <div className="flex flex-1 flex-col gap-2 p-2 lg:gap-4 lg:p-6 max-h-[90vh] overflow-y-scroll">
                  {children}
                </div>
              </div>
            </div>
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
