import { api } from '@/lib/api/axios';
import type { Category, CreateCategoryDto } from '@/types/category';
import { useCategoriesStore } from '@/stores/categories';

/**
 * Hook customizado para gerenciar recursos de categorias.
 * Fornece funções para realizar operações CRUD na API.
 */
export function useCategoriesResource() {
  const { setCategories } = useCategoriesStore();

  /**
   * Busca todas as categorias cadastradas.
   */
  function findAll() {
    return api.get<Category[]>('/categories');
  }

  /**
   * Busca uma categoria pelo ID.
   */
  function findById(id: string) {
    return api.get<Category>(`/categories/${id}`);
  }

  /**
   * Cria uma nova categoria.
   */
  function create(data: CreateCategoryDto) {
    return api.post<Category>('/categories', data);
  }

  /**
   * Carrega todas as categorias e atualiza o store.
   */
  async function loadCategories() {
    const { data } = await findAll();
    setCategories(data);
    return data;
  }

  return {
    findAll,
    findById,
    create,
    loadCategories,
  };
}

