import { CategoryPurpose, TransactionType } from "@/types/person";

/**
 * Utilitários para obter labels de enums.
 * 
 * Centraliza funções de formatação de labels seguindo o princípio DRY.
 * Converte valores de enum para strings legíveis em português.
 */

/**
 * Converte o enum CategoryPurpose para seu label em português.
 * 
 * Mapeamento:
 * - CategoryPurpose.Expense → "Despesa"
 * - CategoryPurpose.Income → "Receita"
 * - CategoryPurpose.Both → "Ambas"
 * 
 * @param purpose Valor do enum CategoryPurpose.
 * @returns Label em português correspondente ao propósito da categoria.
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

/**
 * Converte o enum TransactionType para seu label em português.
 * 
 * Mapeamento:
 * - TransactionType.Expense → "Despesa"
 * - TransactionType.Income → "Receita"
 * 
 * @param type Valor do enum TransactionType.
 * @returns Label em português correspondente ao tipo de transação.
 */
export function getTypeLabel(type: TransactionType): string {
  return type === TransactionType.Expense ? "Despesa" : "Receita";
}

