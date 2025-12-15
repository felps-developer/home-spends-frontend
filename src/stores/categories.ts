import { create } from 'zustand';
import type { Category } from '@/types/category';

/**
 * Store Zustand para gerenciar o estado de categorias.
 * Equivalente ao Pinia store do projeto Vue.
 */
interface CategoriesStore {
  categories: Category[];
  currentCategory: Category | null;
  setCategories: (categories: Category[]) => void;
  setCurrentCategory: (category: Category | null) => void;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  categories: [],
  currentCategory: null,
  setCategories: (categories) => set({ categories }),
  setCurrentCategory: (category) => set({ currentCategory: category }),
}));

