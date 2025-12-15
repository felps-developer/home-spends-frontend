import { CategoryPurpose } from './person';

/**
 * Interface para representação de uma categoria.
 */
export interface Category {
  id: string;
  description: string;
  purpose: CategoryPurpose;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Interface para criação de uma categoria.
 */
export interface CreateCategoryDto {
  description: string;
  purpose: CategoryPurpose;
}

