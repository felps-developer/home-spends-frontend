import { TransactionType } from './person';
import { Category } from './category';
import { Person } from './person';

/**
 * Interface para representação de uma transação.
 */
export interface Transaction {
  id: string;
  description: string;
  value: number;
  type: TransactionType;
  category: Category;
  person: Person;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Interface para criação de uma transação.
 */
export interface CreateTransactionDto {
  description: string;
  value: number;
  type: TransactionType;
  categoryId: string;
  personId: string;
}

