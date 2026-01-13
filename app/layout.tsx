import type { Metadata } from "next";
import "./globals.css";
import { SessionWrapper } from "@/components/SessionWrapper";

export const metadata: Metadata = {
  title: "CS Sales Olympics",
  description: "CS Sales Olympics Dashboard - Track team and individual performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
