"use client";

import { useEffect, useState } from "react";
import { usePeopleResource } from "@/hooks/api/usePeopleResource";
import { usePeopleStore } from "@/stores/people";
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
import type { Person, CreatePersonDto } from "@/types/person";
import { Trash2, Plus } from "lucide-react";

/**
 * Página de listagem e gerenciamento de pessoas.
 * Permite criar, listar e deletar pessoas.
 */
export default function PeoplePage() {
  const { people } = usePeopleStore();
  const resource = usePeopleResource();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePersonDto>({
    name: "",
    age: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      await resource.loadPeople();
    } catch (error) {
      console.error("Erro ao carregar pessoas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!formData.name || formData.age <= 0) {
      alert("Preencha todos os campos corretamente");
      return;
    }

    setLoading(true);
    try {
      await resource.create(formData);
      setOpen(false);
      setFormData({ name: "", age: 0 });
      await loadData();
    } catch (error: any) {
      console.error("Erro ao criar pessoa:", error);
      alert(error.response?.data?.message || "Erro ao criar pessoa");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar esta pessoa? Todas as transações associadas serão apagadas.")) {
      return;
    }

    setLoading(true);
    try {
      await resource.destroy(id);
      await loadData();
    } catch (error: any) {
      console.error("Erro ao deletar pessoa:", error);
      alert(error.response?.data?.message || "Erro ao deletar pessoa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pessoas</h1>
          <p className="text-muted-foreground">
            Gerencie as pessoas cadastradas no sistema
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Pessoa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Pessoa</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar uma nova pessoa
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome da pessoa"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Idade"
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
              <TableHead>Nome</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && people.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : people.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhuma pessoa cadastrada
                </TableCell>
              </TableRow>
            ) : (
              people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.age} anos</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(person.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

