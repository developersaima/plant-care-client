import dns from "node:dns"
dns.setServers(["8.8.8.8","8.8.1.1"])
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

export const metadata:Metadata={
  title:"PlantCare"
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">{children}</main>
        <Toaster/>
      </body>
    </html>
  );
}