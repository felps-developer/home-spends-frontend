"use client";

import { useEffect, useState } from "react";
import { usePeopleResource } from "@/hooks/api/usePeopleResource";
import { usePeopleStore } from "@/stores/people";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, Column } from "@/components/shared/DataTable";
import { CreateDialog } from "@/components/shared/CreateDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Person, CreatePersonDto } from "@/types/person";
import { Trash2 } from "lucide-react";

/**
 * Página de listagem e gerenciamento de pessoas.
 * Permite criar, listar e deletar pessoas.
 */
export default function PeoplePage() {
  const { people } = usePeopleStore();
  const resource = usePeopleResource();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    age: string; // Usar string para permitir campo vazio
  }>({
    name: "",
    age: "",
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
    const age = parseInt(formData.age);
    if (!formData.name || !formData.age || isNaN(age) || age <= 0) {
      alert("Preencha todos os campos corretamente. A idade deve ser um número positivo.");
      return;
    }

    setLoading(true);
    try {
      await resource.create({
        name: formData.name,
        age: age,
      });
      setOpen(false);
      setFormData({ name: "", age: "" });
      await loadData();
    } catch (error: any) {
      console.error("Erro ao criar pessoa:", error);
      alert(error.response?.data?.message || "Erro ao criar pessoa");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Manipula a deleção de uma pessoa.
   * 
   * IMPORTANTE: Ao deletar uma pessoa, todas as transações associadas são deletadas
   * automaticamente pelo backend (DeleteBehavior.Cascade).
   * 
   * Processo:
   * 1. Solicita confirmação do usuário (operação irreversível)
   * 2. Se confirmado, chama a API para deletar
   * 3. Recarrega os dados para atualizar a tabela
   * 
   * @param id Identificador único da pessoa a ser deletada.
   */
  async function handleDelete(id: string) {
    // Solicita confirmação do usuário antes de deletar
    // Avisa que as transações também serão deletadas
    if (!confirm("Tem certeza que deseja deletar esta pessoa? Todas as transações associadas serão apagadas.")) {
      return;
    }

    setLoading(true);
    try {
      // Chama a API para deletar a pessoa
      await resource.destroy(id);
      
      // Recarrega os dados para atualizar a tabela
      await loadData();
    } catch (error: any) {
      console.error("Erro ao deletar pessoa:", error);
      // Exibe mensagem de erro do backend ou mensagem genérica
      alert(error.response?.data?.message || "Erro ao deletar pessoa");
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<Person>[] = [
    {
      key: "name",
      header: "Nome",
      render: (person) => <span className="font-medium">{person.name}</span>,
    },
    {
      key: "age",
      header: "Idade",
      render: (person) => `${person.age} anos`,
    },
    {
      key: "actions",
      header: "Ações",
      className: "text-right",
      render: (person) => (
        <Button
          variant="destructive"
          size="icon"
          onClick={() => handleDelete(person.id)}
          disabled={loading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pessoas"
        description="Gerencie as pessoas cadastradas no sistema"
        action={
          <CreateDialog
            title="Nova Pessoa"
            description="Preencha os dados para cadastrar uma nova pessoa"
            triggerLabel="Nova Pessoa"
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleCreate}
            loading={loading}
          >
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
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Idade"
                />
              </div>
            </div>
          </CreateDialog>
        }
      />

      <DataTable
        data={people}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhuma pessoa cadastrada"
        getRowKey={(person) => person.id}
      />
    </div>
  );
}

