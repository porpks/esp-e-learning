import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ESP E-Learning",
  description: "ESP Group Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </>
        
  );
}