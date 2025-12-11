import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarLayout from "@/components/ui/navbar/layout";
import FooterContainer from "@/components/ui/footer/footer-container";
import ToasterClient from "@/components/ui/toast/toast-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ceruela Coffee Shop",
  description:
    "Ceruela Coffee Shop is a modern online platform for coffee lovers. Browse our menu, place orders, leave reviews, and manage your profile seamlessly. Perfect for customers and coffee enthusiasts seeking a smooth ordering experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f2f2f2]`}
      >
          <ToasterClient />
        <NavbarLayout>
          {children}
          <FooterContainer/>
        </NavbarLayout>
      </body>
    </html>
  );
}
