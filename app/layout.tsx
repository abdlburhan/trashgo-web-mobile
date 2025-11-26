import type { Metadata } from "next";
import { Montserrat, Roboto_Mono } from "next/font/google";
import "./globals.css";

// Font untuk teks
const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-primary",
  subsets: ["latin"],
});

// Font untuk angka
const robotoMono = Roboto_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-numeric",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrashGo",
  description: "Aplikasi Pengelolaan Sampah Modern",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${montserrat.variable} 
          ${robotoMono.variable}
          font-primary
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
