"use client";

import { useEffect, useState } from "react";
import { useTransactionsResource } from "@/hooks/api/useTransactionsResource";
import { useTransactionsStore } from "@/stores/transactions";
import { usePeopleStore } from "@/stores/people";
import { useCategoriesStore } from "@/stores/categories";
import { usePeopleResource } from "@/hooks/api/usePeopleResource";
import { useCategoriesResource } from "@/hooks/api/useCategoriesResource";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateTransactionDto } from "@/types/transaction";
import { TransactionType } from "@/types/person";
import { CategoryPurpose } from "@/types/person";
import { Plus } from "lucide-react";

/**
 * Página de listagem e gerenciamento de transações.
 * Permite criar e listar transações com validações:
 * - Menores de idade (menor de 18 anos) só podem ter despesas
 * - A categoria deve permitir o tipo de transação (despesa/receita)
 */
export default function TransactionsPage() {
  const { transactions } = useTransactionsStore();
  const { people } = usePeopleStore();
  const { categories } = useCategoriesStore();
  const transactionsResource = useTransactionsResource();
  const peopleResource = usePeopleResource();
  const categoriesResource = useCategoriesResource();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTransactionDto>({
    description: "",
    value: 0,
    type: TransactionType.Expense,
    categoryId: "",
    personId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      await Promise.all([
        transactionsResource.loadTransactions(),
        peopleResource.loadPeople(),
        categoriesResource.loadCategories(),
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filtra categorias disponíveis baseado no tipo de transação e pessoa selecionada
  function getAvailableCategories() {
    if (!formData.personId) return categories;

    const person = people.find((p) => p.id === formData.personId);
    if (!person) return categories;

    // Se for menor de idade, só pode ter despesas
    if (person.age < 18 && formData.type === TransactionType.Income) {
      return [];
    }

    // Filtra categorias que permitem o tipo de transação
    return categories.filter((cat) => {
      if (formData.type === TransactionType.Expense) {
        return (
          cat.purpose === CategoryPurpose.Expense ||
          cat.purpose === CategoryPurpose.Both
        );
      } else {
        return (
          cat.purpose === CategoryPurpose.Income ||
          cat.purpose === CategoryPurpose.Both
        );
      }
    });
  }

  async function handleCreate() {
    if (!formData.description || formData.value <= 0 || !formData.categoryId || !formData.personId) {
      alert("Preencha todos os campos corretamente");
      return;
    }

    const person = people.find((p) => p.id === formData.personId);
    if (person && person.age < 18 && formData.type === TransactionType.Income) {
      alert("Menores de idade só podem ter despesas");
      return;
    }

    setLoading(true);
    try {
      await transactionsResource.create(formData);
      setOpen(false);
      setFormData({
        description: "",
        value: 0,
        type: TransactionType.Expense,
        categoryId: "",
        personId: "",
      });
      await loadData();
    } catch (error: any) {
      console.error("Erro ao criar transação:", error);
      alert(error.response?.data?.message || "Erro ao criar transação");
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

  function getTypeLabel(type: TransactionType): string {
    return type === TransactionType.Expense ? "Despesa" : "Receita";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie as transações financeiras
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar uma nova transação
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="person">Pessoa</Label>
                <Select
                  value={formData.personId}
                  onValueChange={(value) => {
                    const person = people.find((p) => p.id === value);
                    setFormData({
                      ...formData,
                      personId: value,
                      // Se for menor de idade, força tipo despesa
                      type:
                        person && person.age < 18
                          ? TransactionType.Expense
                          : formData.type,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name} ({person.age} anos)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: parseInt(value) as TransactionType,
                      categoryId: "", // Limpa categoria ao mudar tipo
                    })
                  }
                  disabled={
                    formData.personId
                      ? people.find((p) => p.id === formData.personId)?.age! <
                        18
                      : false
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TransactionType.Expense.toString()}>
                      Despesa
                    </SelectItem>
                    <SelectItem value={TransactionType.Income.toString()}>
                      Receita
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.personId &&
                  people.find((p) => p.id === formData.personId)?.age! < 18 && (
                    <p className="text-sm text-muted-foreground">
                      Menores de idade só podem ter despesas
                    </p>
                  )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCategories().map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getAvailableCategories().length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma categoria disponível para este tipo de transação
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição da transação"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={loading}>
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Pessoa</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhuma transação cadastrada
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>{transaction.person.name}</TableCell>
                  <TableCell>{transaction.category.description}</TableCell>
                  <TableCell>{getTypeLabel(transaction.type)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(transaction.value)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

