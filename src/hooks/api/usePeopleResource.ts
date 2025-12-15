import { api } from '@/lib/api/axios';
import type { Person, CreatePersonDto } from '@/types/person';
import { usePeopleStore } from '@/stores/people';

/**
 * Hook customizado para gerenciar recursos de pessoas.
 * Fornece funções para realizar operações CRUD na API.
 */
export function usePeopleResource() {
  const { setPeople } = usePeopleStore();

  /**
   * Busca todas as pessoas cadastradas.
   */
  function findAll() {
    return api.get<Person[]>('/people');
  }

  /**
   * Busca uma pessoa pelo ID.
   */
  function findById(id: string) {
    return api.get<Person>(`/people/${id}`);
  }

  /**
   * Cria uma nova pessoa.
   */
  function create(data: CreatePersonDto) {
    return api.post<Person>('/people', data);
  }

  /**
   * Deleta uma pessoa pelo ID.
   * Ao deletar uma pessoa, todas as transações dessa pessoa são apagadas automaticamente.
   */
  function destroy(id: string) {
    return api.delete(`/people/${id}`);
  }

  /**
   * Carrega todas as pessoas e atualiza o store.
   */
  async function loadPeople() {
    const { data } = await findAll();
    setPeople(data);
    return data;
  }

  return {
    findAll,
    findById,
    create,
    destroy,
    loadPeople,
  };
}

