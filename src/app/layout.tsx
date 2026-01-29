import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { SkipToContent } from "@/components/accessibility/SkipToContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medical Assistant - Hospital Patient Support",
  description:
    "A supportive tool to help hospital patients and their loved ones understand medical information. Not a substitute for professional medical advice.",
  keywords: [
    "medical assistant",
    "hospital patient",
    "healthcare",
    "patient education",
    "medical information",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-normal">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AccessibilityProvider>
          <SkipToContent />
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
