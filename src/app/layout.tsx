import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MITRE ATT&CK Browser",
  description: "Browse MITRE ATT&CK Enterprise Matrix techniques and tactics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen grid-pattern`}>
        {children}
      </body>
    </html>
  );
}
