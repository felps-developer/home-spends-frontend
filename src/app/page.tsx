"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Página inicial (Dashboard).
 * Exibe um resumo geral e links rápidos para as principais funcionalidades.
 */
export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de controle de gastos residenciais
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Pessoas</CardTitle>
            <CardDescription>Gerencie as pessoas cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/people">
              <Button className="w-full">Ver Pessoas</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>Gerencie as categorias de transações</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/categories">
              <Button className="w-full">Ver Categorias</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transações</CardTitle>
            <CardDescription>Gerencie as transações financeiras</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/transactions">
              <Button className="w-full">Ver Transações</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
            <CardDescription>Visualize relatórios e totais</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports">
              <Button className="w-full">Ver Relatórios</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

