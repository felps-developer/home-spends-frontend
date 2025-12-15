"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Layout principal da aplicação.
 * 
 * Características:
 * - Layout fixo com sidebar lateral e área de conteúdo principal
 * - Navegação lateral com links para todas as páginas principais
 * - Destaque visual para a página ativa (baseado na URL atual)
 * - Responsivo: sidebar fixo à esquerda, conteúdo principal com margem
 * 
 * Estrutura:
 * - Sidebar fixo (64 unidades de largura) com logo e navegação
 * - Área de conteúdo principal com padding e container responsivo
 * 
 * @param children Conteúdo da página que será renderizado dentro do layout.
 */
export function MainLayout({ children }: { children: React.ReactNode }) {
  // Obtém o caminho atual da URL para destacar a página ativa
  const pathname = usePathname();

  // Configuração da navegação lateral
  // Cada item tem nome, href (rota) e ícone para identificação visual
  const navigation = [
    { name: "Relatórios", href: "/", icon: "📈" },
    { name: "Pessoas", href: "/people", icon: "👥" },
    { name: "Categorias", href: "/categories", icon: "📁" },
    { name: "Transações", href: "/transactions", icon: "💰" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar fixo à esquerda */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <div className="flex h-full flex-col">
          {/* Header do sidebar com logo/título */}
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold">Home Spends</h1>
          </div>
          {/* Navegação lateral */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              // Verifica se a rota atual corresponde ao item de navegação
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    // Estilo diferente para item ativo vs inativo
                    isActive
                      ? "bg-primary text-primary-foreground" // Item ativo: fundo primário
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground" // Item inativo: hover effect
                  )}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Área de conteúdo principal */}
      {/* pl-64: padding-left igual à largura do sidebar para não sobrepor */}
      <div className="pl-64">
        {/* Container responsivo com padding para o conteúdo */}
        <main className="container mx-auto py-8 px-6">{children}</main>
      </div>
    </div>
  );
}

