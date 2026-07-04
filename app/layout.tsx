import type { Metadata } from "next";
import { Pixelify_Sans, Nunito } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixel Pond",
  description: "A cozy pixel-art fishing web application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pixelpond">
      <body
        className={`${pixelifySans.variable} ${nunito.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
