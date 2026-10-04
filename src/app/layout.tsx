import type { Metadata } from "next";
import "./globals.css";
import RegisterSW from "./components/RegisterSW";

export const metadata: Metadata = {
  title: "ADVZPMEMonitor - Agência de Desenvolvimento do Vale do Zambeze",
  description: "Sistema de Monitoria de Subprojectos",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT">
      <body>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
