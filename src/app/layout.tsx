import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { PopupProvider } from "@/components/PopupProvider";
import { SWRProvider } from "@/components/SWRProvider";

export const metadata: Metadata = {
  title: "Active Chapter",
  description: "Active Chapter NYC official online presence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Space+Grotesk:wght@300..700&family=Yantramanav:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="max-h-dvh overflow-y-hidden font-space text-2xl selection:bg-[#FFFF00]">
        <SWRProvider>
          <PopupProvider>
            <Suspense>{children}</Suspense>
          </PopupProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
