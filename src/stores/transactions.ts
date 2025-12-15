import { create } from 'zustand';
import type { Transaction } from '@/types/transaction';

/**
 * Store Zustand para gerenciar o estado de transações.
 * Equivalente ao Pinia store do projeto Vue.
 */
interface TransactionsStore {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  setTransactions: (transactions: Transaction[]) => void;
  setCurrentTransaction: (transaction: Transaction | null) => void;
}

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: [],
  currentTransaction: null,
  setTransactions: (transactions) => set({ transactions }),
  setCurrentTransaction: (transaction) => set({ currentTransaction: transaction }),
}));

