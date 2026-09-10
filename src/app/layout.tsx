import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers";
import { parseLocale } from "@/i18n/config";
import "./globals.css";

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

  return (
    <html lang={locale} className={theme}>
      <body className="min-h-screen antialiased">
        <Providers locale={locale} theme={theme}>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
