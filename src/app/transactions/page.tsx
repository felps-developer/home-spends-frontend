"use client";

import { useEffect, useState } from "react";
import { useTransactionsResource } from "@/hooks/api/useTransactionsResource";
import { useTransactionsStore } from "@/stores/transactions";
import { usePeopleStore } from "@/stores/people";
import { useCategoriesStore } from "@/stores/categories";
import { usePeopleResource } from "@/hooks/api/usePeopleResource";
import { useCategoriesResource } from "@/hooks/api/useCategoriesResource";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, Column } from "@/components/shared/DataTable";
import { CreateDialog } from "@/components/shared/CreateDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatCurrency } from "@/lib/utils/format";
import { getTypeLabel } from "@/lib/utils/labels";
import type { CreateTransactionDto, Transaction } from "@/types/transaction";
import { TransactionType, CategoryPurpose } from "@/types/person";

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
  const [formData, setFormData] = useState<{
    description: string;
    value: string; // Usar string para permitir campo vazio
    type: TransactionType;
    categoryId: string;
    personId: string;
  }>({
    description: "",
    value: "",
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

  /**
   * Filtra categorias disponíveis baseado no tipo de transação e pessoa selecionada.
   * 
   * Regras de negócio aplicadas:
   * 1. Se nenhuma pessoa estiver selecionada, retorna todas as categorias
   * 2. Se a pessoa for menor de idade (< 18 anos) e o tipo for Receita, retorna array vazio
   *    (menores só podem ter despesas)
   * 3. Filtra categorias que permitem o tipo de transação selecionado:
   *    - Para Despesa: categorias com Purpose = Expense ou Both
   *    - Para Receita: categorias com Purpose = Income ou Both
   * 
   * @returns Array de categorias disponíveis para a combinação pessoa/tipo selecionada.
   */
  function getAvailableCategories() {
    // Se não há pessoa selecionada, retorna todas as categorias
    if (!formData.personId) return categories;

    // Busca a pessoa selecionada
    const person = people.find((p) => p.id === formData.personId);
    if (!person) return categories;

    // Regra de negócio: Menores de idade só podem ter despesas
    // Se for menor e o tipo for Receita, não há categorias disponíveis
    if (person.age < 18 && formData.type === TransactionType.Income) {
      return [];
    }

    // Filtra categorias que permitem o tipo de transação selecionado
    return categories.filter((cat) => {
      if (formData.type === TransactionType.Expense) {
        // Para despesas: aceita categorias de despesa ou ambas
        return (
          cat.purpose === CategoryPurpose.Expense ||
          cat.purpose === CategoryPurpose.Both
        );
      } else {
        // Para receitas: aceita categorias de receita ou ambas
        return (
          cat.purpose === CategoryPurpose.Income ||
          cat.purpose === CategoryPurpose.Both
        );
      }
    });
  }

  /**
   * Manipula a criação de uma nova transação.
   * 
   * Validações aplicadas:
   * 1. Todos os campos obrigatórios devem estar preenchidos
   * 2. O valor deve ser um número positivo
   * 3. Menores de idade não podem ter receitas (apenas despesas)
   * 
   * Após criação bem-sucedida:
   * - Fecha o diálogo
   * - Limpa o formulário
   * - Recarrega os dados da tabela
   */
  async function handleCreate() {
    // Converte o valor de string para número
    const value = parseFloat(formData.value);
    
    // Validação: verifica se todos os campos obrigatórios estão preenchidos
    if (!formData.description || !formData.value || isNaN(value) || value <= 0 || !formData.categoryId || !formData.personId) {
      alert("Preencha todos os campos corretamente. O valor deve ser um número positivo.");
      return;
    }

    // Validação de regra de negócio: menores de idade só podem ter despesas
    const person = people.find((p) => p.id === formData.personId);
    if (person && person.age < 18 && formData.type === TransactionType.Income) {
      alert("Menores de idade só podem ter despesas");
      return;
    }

    setLoading(true);
    try {
      // Cria a transação através da API
      await transactionsResource.create({
        description: formData.description,
        value: value,
        type: formData.type,
        categoryId: formData.categoryId,
        personId: formData.personId,
      });
      
      // Fecha o diálogo após sucesso
      setOpen(false);
      
      // Limpa o formulário para próxima criação
      setFormData({
        description: "",
        value: "",
        type: TransactionType.Expense,
        categoryId: "",
        personId: "",
      });
      
      // Recarrega os dados para atualizar a tabela
      await loadData();
    } catch (error: any) {
      console.error("Erro ao criar transação:", error);
      // Exibe mensagem de erro do backend ou mensagem genérica
      alert(error.response?.data?.message || "Erro ao criar transação");
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<Transaction>[] = [
    {
      key: "description",
      header: "Descrição",
      render: (transaction) => (
        <span className="font-medium">{transaction.description}</span>
      ),
    },
    {
      key: "person",
      header: "Pessoa",
      render: (transaction) => transaction.person.name,
    },
    {
      key: "category",
      header: "Categoria",
      render: (transaction) => transaction.category.description,
    },
    {
      key: "type",
      header: "Tipo",
      render: (transaction) => getTypeLabel(transaction.type),
    },
    {
      key: "value",
      header: "Valor",
      className: "text-right",
      render: (transaction) => formatCurrency(transaction.value),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transações"
        description="Gerencie as transações financeiras"
        action={
          <CreateDialog
            title="Nova Transação"
            description="Preencha os dados para cadastrar uma nova transação"
            triggerLabel="Nova Transação"
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleCreate}
            loading={loading}
          >
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
                      value: e.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
          </CreateDialog>
        }
      />

      <DataTable
        data={transactions}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhuma transação cadastrada"
        getRowKey={(transaction) => transaction.id}
      />
    </div>
  );
}

