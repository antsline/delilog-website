import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://delilog.app"),
  title: "delilog - 軽貨物ドライバーのための業務記録アプリ",
  description: "点検・点呼・運行記録をスマホ1台で完結。法定点検項目・アルコールチェック・国交省様式PDF出力に対応。基本無料。",
  // Google Search Console verification: Search Consoleで「HTMLタグ」方式を選び、発行されたcontent値をここに貼る
  // verification: {
  //   google: "ここにSearch Consoleが発行した認証コードを貼る",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
