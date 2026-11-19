import QueryProvider from "@/components/QueryProviders";
import { AppToaster } from "@/components/AppToaster";
import { ThemeScript } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { MobileBlocker } from "@/components/ui/MobileBlocker";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Switch", template: "%s · Switch" },
  description: "Project management for focused teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={cn("font-sans", geist.variable)}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <MobileBlocker>
          <QueryProvider>{children}</QueryProvider>
        </MobileBlocker>
        <AppToaster />
      </body>
    </html>
  );
}
