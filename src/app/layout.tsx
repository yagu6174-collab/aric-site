import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { Providers } from "@/components/providers";
import { colorVars } from "@/lib/draft";
import { loadPublic } from "@/lib/site-io";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await loadPublic();
  const title = `${copy.name} ${copy.nameEn}`.trim();
  return {
    title: { default: title, template: `%s · ${title}` },
    description: copy.home.heroSubtitle,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const model = await loadPublic();

  return (
    <html lang="zh-CN" className={display.variable} style={colorVars(model.colors)}>
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
        <Providers source={model.copy} traditional={model.traditionalCopy}>
          <SiteShell profile={model.profile} profileTraditional={model.traditionalProfile}>
            {children}
          </SiteShell>
        </Providers>
      </body>
    </html>
  );
}
