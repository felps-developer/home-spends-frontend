import { api } from '@/lib/api/axios';
import type { Transaction, CreateTransactionDto } from '@/types/transaction';
import { useTransactionsStore } from '@/stores/transactions';

/**
 * Hook customizado para gerenciar recursos de transações.
 * Fornece funções para realizar operações CRUD na API.
 */
export function useTransactionsResource() {
  const { setTransactions } = useTransactionsStore();

  /**
   * Busca todas as transações cadastradas.
   */
  function findAll() {
    return api.get<Transaction[]>('/transactions');
  }

  /**
   * Busca uma transação pelo ID.
   */
  function findById(id: string) {
    return api.get<Transaction>(`/transactions/${id}`);
  }

  /**
   * Cria uma nova transação.
   * Validações aplicadas:
   * - Menores de idade (menor de 18 anos) só podem ter despesas
   * - A categoria deve permitir o tipo de transação (despesa/receita)
   */
  function create(data: CreateTransactionDto) {
    return api.post<Transaction>('/transactions', data);
  }

  /**
   * Carrega todas as transações e atualiza o store.
   */
  async function loadTransactions() {
    const { data } = await findAll();
    setTransactions(data);
    return data;
  }

  return {
    findAll,
    findById,
    create,
    loadTransactions,
  };
}

