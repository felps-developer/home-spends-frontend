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

/**
 * Props do componente CreateDialog.
 */
interface CreateDialogProps {
  /** Título exibido no cabeçalho do diálogo. */
  title: string;
  /** Descrição exibida abaixo do título. */
  description: string;
  /** Texto do botão que abre o diálogo. */
  triggerLabel?: string;
  /** Conteúdo do formulário (campos de input, selects, etc.). */
  children: ReactNode;
  /** Função chamada quando o formulário é submetido. Pode ser assíncrona. */
  onSubmit: () => Promise<void> | void;
  /** Indica se o formulário está sendo processado (desabilita botões). */
  loading?: boolean;
  /** Controla o estado aberto/fechado do diálogo (modo controlado). */
  open?: boolean;
  /** Callback chamado quando o estado aberto/fechado muda (modo controlado). */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Componente de diálogo reutilizável para criação de entidades.
 * 
 * Características:
 * - Reutilizável: usado em todas as páginas de criação (Pessoas, Categorias, Transações)
 * - Flexível: suporta modo controlado e não-controlado
 * - Responsável: gerencia abertura/fechamento e submissão do formulário
 * - Seguro: mantém diálogo aberto em caso de erro para o usuário ver a mensagem
 * 
 * Modos de uso:
 * - Não-controlado: gerencia seu próprio estado interno (open/onOpenChange não fornecidos)
 * - Controlado: estado gerenciado externamente (open/onOpenChange fornecidos)
 * 
 * Segue os princípios:
 * - DRY (Don't Repeat Yourself): evita duplicação de código de diálogo
 * - Single Responsibility: apenas responsável por exibir e gerenciar diálogo de criação
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
  // Estado interno para modo não-controlado
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Determina se está em modo controlado (baseado na presença da prop open)
  const isControlled = controlledOpen !== undefined;
  // Usa estado controlado se fornecido, caso contrário usa estado interno
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  /**
   * Manipula a submissão do formulário.
   * Fecha o diálogo apenas se a submissão for bem-sucedida.
   * Em caso de erro, mantém o diálogo aberto para o usuário ver a mensagem de erro.
   */
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

