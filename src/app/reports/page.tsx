"use client";

import { useEffect, useState } from "react";
import { useReportsResource } from "@/hooks/api/useReportsResource";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PersonTotalsReport, CategoryTotalsReport } from "@/types/reports";

/**
 * Página de relatórios.
 * Exibe totais por pessoa e por categoria.
 */
export default function ReportsPage() {
  const reportsResource = useReportsResource();
  const [loading, setLoading] = useState(false);
  const [personTotals, setPersonTotals] = useState<PersonTotalsReport | null>(null);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotalsReport | null>(null);
  const [activeTab, setActiveTab] = useState<"people" | "categories">("people");

  useEffect(() => {
    loadPersonTotals();
  }, []);

  async function loadPersonTotals() {
    setLoading(true);
    try {
      const { data } = await reportsResource.getPersonTotals();
      setPersonTotals(data);
      setActiveTab("people");
    } catch (error) {
      console.error("Erro ao carregar relatório de pessoas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategoryTotals() {
    setLoading(true);
    try {
      const { data } = await reportsResource.getCategoryTotals();
      setCategoryTotals(data);
      setActiveTab("categories");
    } catch (error) {
      console.error("Erro ao carregar relatório de categorias:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize totais por pessoa e por categoria
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          variant={activeTab === "people" ? "default" : "outline"}
          onClick={loadPersonTotals}
        >
          Totais por Pessoa
        </Button>
        <Button
          variant={activeTab === "categories" ? "default" : "outline"}
          onClick={loadCategoryTotals}
        >
          Totais por Categoria
        </Button>
      </div>

      {activeTab === "people" && (
        <Card>
          <CardHeader>
            <CardTitle>Totais por Pessoa</CardTitle>
            <CardDescription>
              Lista todas as pessoas com seus totais de receitas, despesas e saldo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Carregando...</p>
            ) : personTotals ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pessoa</TableHead>
                      <TableHead className="text-right">Total Receitas</TableHead>
                      <TableHead className="text-right">Total Despesas</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personTotals.people.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Nenhum dado disponível
                        </TableCell>
                      </TableRow>
                    ) : (
                      personTotals.people.map((person) => (
                        <TableRow key={person.personId}>
                          <TableCell className="font-medium">
                            {person.personName}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(person.totalIncome)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(person.totalExpense)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              person.balance >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatCurrency(person.balance)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">Total Geral</TableCell>
                      <TableCell className="text-right text-green-600 font-bold">
                        {formatCurrency(personTotals.summary.totalIncome)}
                      </TableCell>
                      <TableCell className="text-right text-red-600 font-bold">
                        {formatCurrency(personTotals.summary.totalExpense)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          personTotals.summary.netBalance >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(personTotals.summary.netBalance)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Clique em "Totais por Pessoa" para carregar o relatório
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "categories" && (
        <Card>
          <CardHeader>
            <CardTitle>Totais por Categoria</CardTitle>
            <CardDescription>
              Lista todas as categorias com seus totais de receitas, despesas e saldo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Carregando...</p>
            ) : categoryTotals ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Total Receitas</TableHead>
                      <TableHead className="text-right">Total Despesas</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryTotals.categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Nenhum dado disponível
                        </TableCell>
                      </TableRow>
                    ) : (
                      categoryTotals.categories.map((category) => (
                        <TableRow key={category.categoryId}>
                          <TableCell className="font-medium">
                            {category.categoryDescription}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(category.totalIncome)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(category.totalExpense)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              category.balance >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatCurrency(category.balance)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">Total Geral</TableCell>
                      <TableCell className="text-right text-green-600 font-bold">
                        {formatCurrency(categoryTotals.summary.totalIncome)}
                      </TableCell>
                      <TableCell className="text-right text-red-600 font-bold">
                        {formatCurrency(categoryTotals.summary.totalExpense)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          categoryTotals.summary.netBalance >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(categoryTotals.summary.netBalance)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Clique em "Totais por Categoria" para carregar o relatório
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

