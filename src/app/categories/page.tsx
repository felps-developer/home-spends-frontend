"use client";

import { useEffect, useState } from "react";
import { useCategoriesResource } from "@/hooks/api/useCategoriesResource";
import { useCategoriesStore } from "@/stores/categories";
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
import type { CreateCategoryDto, Category } from "@/types/category";
import { CategoryPurpose } from "@/types/person";
import { getPurposeLabel } from "@/lib/utils/labels";

/**
 * Página de listagem e gerenciamento de categorias.
 * Permite criar e listar categorias.
 */
export default function CategoriesPage() {
  const { categories } = useCategoriesStore();
  const resource = useCategoriesResource();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryDto>({
    description: "",
    purpose: CategoryPurpose.Both,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      await resource.loadCategories();
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!formData.description) {
      alert("Preencha a descrição");
      return;
    }

    setLoading(true);
    try {
      await resource.create(formData);
      setOpen(false);
      setFormData({ description: "", purpose: CategoryPurpose.Both });
      await loadData();
    } catch (error: any) {
      console.error("Erro ao criar categoria:", error);
      alert(error.response?.data?.message || "Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<Category>[] = [
    {
      key: "description",
      header: "Descrição",
      render: (category) => (
        <span className="font-medium">{category.description}</span>
      ),
    },
    {
      key: "purpose",
      header: "Finalidade",
      render: (category) => getPurposeLabel(category.purpose),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorias"
        description="Gerencie as categorias de transações"
        action={
          <CreateDialog
            title="Nova Categoria"
            description="Preencha os dados para cadastrar uma nova categoria"
            triggerLabel="Nova Categoria"
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleCreate}
            loading={loading}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição da categoria"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Finalidade</Label>
                <Select
                  value={formData.purpose.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      purpose: parseInt(value) as CategoryPurpose,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a finalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CategoryPurpose.Expense.toString()}>
                      Despesa
                    </SelectItem>
                    <SelectItem value={CategoryPurpose.Income.toString()}>
                      Receita
                    </SelectItem>
                    <SelectItem value={CategoryPurpose.Both.toString()}>
                      Ambas
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CreateDialog>
        }
      />

      <DataTable
        data={categories}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhuma categoria cadastrada"
        getRowKey={(category) => category.id}
      />
    </div>
  );
}

