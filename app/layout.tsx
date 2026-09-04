import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle"; // <--- 1. Import ปุ่มเข้ามา

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enterprise Learning Hub",
  description: "ระบบจัดการความรู้ภายในองค์กร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          {/* 2. เอาปุ่มลอยมาวางไว้ตรงนี้ จะได้แสดงทุกหน้า */}
          <ThemeToggle /> 
        </ThemeProvider>
      </body>
    </html>
  );
}