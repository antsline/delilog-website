import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "delilog - 配送業務管理アプリ",
  description: "運送業務の記録を一元管理。車両日常点検、業務前点呼、業務後点呼を簡単に記録。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
