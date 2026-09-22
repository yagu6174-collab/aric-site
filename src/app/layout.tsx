import type { Metadata } from "next";
import { Newsreader, Noto_Serif_SC, Roboto_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers";
import { parseLocale } from "@/i18n/config";
import { getHomeCopy } from "@/lib/content";
import { cn } from "@/lib/utils";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-newsreader",
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-noto-serif",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "陆恩惠 Aric",
  description: "理财见解、履历与摄影自留地",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const locale = parseLocale(jar.get("locale")?.value);
  const theme = jar.get("theme")?.value === "light" ? "light" : "dark";
  const homeCopy = await getHomeCopy();

  return (
    <html
      lang={locale}
      className={cn(theme, newsreader.variable, notoSerif.variable, robotoMono.variable)}
    >
      <body className="min-h-screen antialiased">
        <Providers locale={locale} theme={theme} homeCopy={homeCopy}>
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
