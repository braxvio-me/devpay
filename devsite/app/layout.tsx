import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter throughout: the app's own face, set tight and heavy for display.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevPay · Freelance work, paid safely",
  description:
    "Escrow for Ghana’s freelancers and the clients who hire them. Every milestone is funded before work starts and paid out to Mobile Money when it’s approved.",
  icons: { icon: "/logo-mark.png" },
  openGraph: {
    title: "DevPay · Money first. Then the work.",
    description: "Milestone escrow for Ghana, paid out to Mobile Money.",
    images: ["/logo-mark.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1C6E99",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" className={`${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
