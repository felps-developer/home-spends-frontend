/**
 * Utilitários para formatação de dados.
 * Centraliza funções de formatação reutilizáveis seguindo o princípio DRY.
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

