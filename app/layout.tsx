import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
