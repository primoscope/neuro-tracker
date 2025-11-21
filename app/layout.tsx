import type { Metadata } from "next";
import "./globals.css";
import { StorageProvider } from "@/lib/storage";

export const metadata: Metadata = {
  title: "NeuroStack - Medication Tracker",
  description: "Flexible medication and supplement tracking with cloud sync or local storage",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <StorageProvider>
          {children}
        </StorageProvider>
      </body>
    </html>
  );
}
