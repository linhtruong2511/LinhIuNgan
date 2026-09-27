import type { Metadata, Viewport } from "next";
import { Inter, Dancing_Script, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-dancing",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday Bạn nhỏ ❤️",
  description: "Một điều bất ngờ dành riêng cho em",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${dancingScript.variable} ${greatVibes.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
