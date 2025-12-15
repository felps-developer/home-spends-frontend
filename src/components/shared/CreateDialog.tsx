"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface CreateDialogProps {
  title: string;
  description: string;
  triggerLabel?: string;
  children: ReactNode;
  onSubmit: () => Promise<void> | void;
  loading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Componente de diálogo reutilizável para criação de entidades.
 * Segue o princípio DRY e Single Responsibility.
 */
export function CreateDialog({
  title,
  description,
  triggerLabel = "Novo Item",
  children,
  onSubmit,
  loading = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  async function handleSubmit() {
    try {
      await onSubmit();
      // Fecha o diálogo após submit bem-sucedido
      if (isControlled && controlledOnOpenChange) {
        controlledOnOpenChange(false);
      } else {
        setInternalOpen(false);
      }
    } catch (error) {
      // Em caso de erro, mantém o diálogo aberto para o usuário ver a mensagem
      console.error("Erro ao submeter formulário:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

