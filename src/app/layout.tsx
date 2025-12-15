import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { MainLayout } from "@/components/shared/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Spends - Controle de Gastos Residenciais",
  description: "Sistema de controle de gastos residenciais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

