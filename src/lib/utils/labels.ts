import { CategoryPurpose, TransactionType } from "@/types/person";

/**
 * Utilitários para obter labels de enums.
 * Centraliza funções de formatação de labels seguindo o princípio DRY.
 */

export function getPurposeLabel(purpose: CategoryPurpose): string {
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

export function getTypeLabel(type: TransactionType): string {
  return type === TransactionType.Expense ? "Despesa" : "Receita";
}

