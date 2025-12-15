"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Layout principal da aplicação.
 * Inclui navegação lateral e header.
 */
export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "📊" },
    { name: "Pessoas", href: "/people", icon: "👥" },
    { name: "Categorias", href: "/categories", icon: "📁" },
    { name: "Transações", href: "/transactions", icon: "💰" },
    { name: "Relatórios", href: "/reports", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold">Home Spends</h1>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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

      {/* Main content */}
      <div className="pl-64">
        <main className="container mx-auto py-8 px-6">{children}</main>
      </div>
    </div>
  );
}

