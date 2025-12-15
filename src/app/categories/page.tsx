"use client";

import { useEffect, useState } from "react";
import { useCategoriesResource } from "@/hooks/api/useCategoriesResource";
import { useCategoriesStore } from "@/stores/categories";
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
import type { CreateCategoryDto } from "@/types/category";
import { CategoryPurpose } from "@/types/person";
import { Plus } from "lucide-react";

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

  function getPurposeLabel(purpose: CategoryPurpose): string {
    switch (purpose) {
      case CategoryPurpose.Expense:
        return "Despesa";
      case CategoryPurpose.Income:
        return "Receita";
      case CategoryPurpose.Both:
        return "Ambas";
      default:
        return "";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias de transações
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar uma nova categoria
              </DialogDescription>
            </DialogHeader>
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
              <TableHead>Finalidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  Nenhuma categoria cadastrada
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.description}
                  </TableCell>
                  <TableCell>{getPurposeLabel(category.purpose)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

