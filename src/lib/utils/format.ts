/**
 * Utilitários para formatação de dados.
 * 
 * Centraliza funções de formatação reutilizáveis seguindo o princípio DRY.
 * Todas as funções de formatação devem estar aqui para evitar duplicação.
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL).
 * 
 * Usa a API Intl.NumberFormat do JavaScript para formatação internacionalizada.
 * Formato: R$ 1.234,56
 * 
 * Exemplos:
 * - formatCurrency(1000) → "R$ 1.000,00"
 * - formatCurrency(1234.56) → "R$ 1.234,56"
 * - formatCurrency(0.50) → "R$ 0,50"
 * 
 * @param value Valor numérico a ser formatado.
 * @returns String formatada como moeda brasileira.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

