/**
 * Interface para representar os totais de uma pessoa.
 */
export interface PersonTotals {
  personId: string;
  personName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Interface para representar o resumo geral de totais.
 */
export interface TotalsSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

/**
 * Interface para o relatório de totais por pessoa.
 */
export interface PersonTotalsReport {
  people: PersonTotals[];
  summary: TotalsSummary;
}

/**
 * Interface para representar os totais de uma categoria.
 */
export interface CategoryTotals {
  categoryId: string;
  categoryDescription: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Interface para o relatório de totais por categoria.
 */
export interface CategoryTotalsReport {
  categories: CategoryTotals[];
  summary: TotalsSummary;
}

