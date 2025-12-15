import { api } from '@/lib/api/axios';
import type { PersonTotalsReport, CategoryTotalsReport } from '@/types/reports';

/**
 * Hook customizado para gerenciar recursos de relatórios.
 * Fornece funções para buscar relatórios de totais.
 */
export function useReportsResource() {
  /**
   * Busca o relatório de totais por pessoa.
   * Lista todas as pessoas cadastradas, exibindo o total de receitas,
   * despesas e o saldo de cada uma, além do total geral.
   */
  function getPersonTotals() {
    return api.get<PersonTotalsReport>('/reports/person-totals');
  }

  /**
   * Busca o relatório de totais por categoria (opcional).
   * Lista todas as categorias cadastradas, exibindo o total de receitas,
   * despesas e o saldo de cada uma, além do total geral.
   */
  function getCategoryTotals() {
    return api.get<CategoryTotalsReport>('/reports/category-totals');
  }

  return {
    getPersonTotals,
    getCategoryTotals,
  };
}

