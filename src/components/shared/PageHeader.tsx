"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

/**
 * Componente de cabeçalho de página reutilizável.
 * Segue o princípio DRY e Single Responsibility.
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

