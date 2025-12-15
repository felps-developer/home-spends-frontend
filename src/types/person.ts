/**
 * Enum que define a finalidade de uma categoria.
 */
export enum CategoryPurpose {
  /** Categoria apenas para despesas. */
  Expense = 1,
  /** Categoria apenas para receitas. */
  Income = 2,
  /** Categoria para ambas (despesas e receitas). */
  Both = 3,
}

/**
 * Enum que define o tipo de transação.
 */
export enum TransactionType {
  /** Transação de despesa (gasto). */
  Expense = 1,
  /** Transação de receita (ganho). */
  Income = 2,
}

/**
 * Interface para representação de uma pessoa.
 */
export interface Person {
  id: string;
  name: string;
  age: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Interface para criação de uma pessoa.
 */
export interface CreatePersonDto {
  name: string;
  age: number;
}

