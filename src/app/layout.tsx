import type { Metadata } from "next";
import { Roboto, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMonoHeading = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const roboto = Roboto({ 
  subsets: ["latin"], 
  variable: "--font-sans" });


export const metadata: Metadata = {
  title: "Memoflare",
  description: "A Smart Study System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "dark",
        "font-sans",
        roboto.variable,
        jetbrainsMonoHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
