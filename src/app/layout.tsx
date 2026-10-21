import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers";
import { getSite } from "@/lib/content";
import { mapStringsDeep, toZhTW } from "@/lib/locale-sync";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "陆恩惠 Aric",
    template: "%s · 陆恩惠 Aric",
  },
  description: "理财顾问，写一点自己的看法。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSite();

  return (
    <html lang="zh-CN" className={display.variable}>
      <head>
        <link
          rel="preload"
          href="/fonts/noto-serif-sc-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/noto-serif-sc-500.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>
          <Header />
          <main id="content" className="site-main">
            {children}
          </main>
          <Footer site={site} siteTraditional={mapStringsDeep(site, toZhTW)} />
        </Providers>
      </body>
    </html>
  );
}
