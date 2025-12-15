"use client";

import { ReactNode } from "react";

/**
 * Props do componente PageHeader.
 */
interface PageHeaderProps {
  /** Título principal da página (exibido em destaque). */
  title: string;
  /** Descrição/subtítulo da página (exibido abaixo do título). */
  description: string;
  /** Elemento opcional de ação (geralmente um botão) exibido à direita do cabeçalho. */
  action?: ReactNode;
}

/**
 * Componente de cabeçalho de página reutilizável.
 * 
 * Características:
 * - Reutilizável: usado em todas as páginas principais (Pessoas, Categorias, Transações, Relatórios)
 * - Consistente: mantém o mesmo layout e estilo em todas as páginas
 * - Flexível: permite adicionar ações customizadas (botões, etc.) à direita
 * 
 * Estrutura:
 * - Título principal (h1) em destaque
 * - Descrição/subtítulo abaixo do título
 * - Área de ação opcional à direita (para botões de criação, etc.)
 * 
 * Segue os princípios:
 * - DRY (Don't Repeat Yourself): evita duplicação de código de cabeçalho
 * - Single Responsibility: apenas responsável por exibir cabeçalho de página
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Área de título e descrição */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {/* Área de ação (botões, etc.) - renderizada apenas se fornecida */}
      {action && <div>{action}</div>}
    </div>
  );
}

