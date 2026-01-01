// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BGC Filo Yönetim Sistemi",
  description: "Kurumsal Araç Takip Paneli",
};

// Next.js'in aradığı ana bileşen (Default Export) budur:
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* suppressHydrationWarning: Tarayıcı eklentilerinin hatasını engeller */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
