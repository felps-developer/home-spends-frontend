"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Interface que define uma coluna da tabela.
 * @template T Tipo do item de dados que será exibido na tabela.
 */
export interface Column<T> {
  /** Chave única da coluna, também usada para acessar o valor do item se não houver render customizado. */
  key: string;
  /** Texto exibido no cabeçalho da coluna. */
  header: string;
  /** Função opcional para renderizar o conteúdo da célula de forma customizada. */
  render?: (item: T) => React.ReactNode;
  /** Classes CSS opcionais para estilizar a coluna. */
  className?: string;
}

/**
 * Props do componente DataTable.
 * @template T Tipo do item de dados que será exibido na tabela.
 */
interface DataTableProps<T> {
  /** Array de dados a serem exibidos na tabela. */
  data: T[];
  /** Array de definições de colunas que especifica como os dados serão exibidos. */
  columns: Column<T>[];
  /** Indica se os dados estão sendo carregados. */
  loading?: boolean;
  /** Mensagem exibida quando não há dados para mostrar. */
  emptyMessage?: string;
  /** Mensagem exibida durante o carregamento. */
  loadingMessage?: string;
  /** Função que retorna uma chave única para cada item (usada como key do React). */
  getRowKey: (item: T) => string | number;
}

/**
 * Componente de tabela reutilizável e genérico.
 * 
 * Características:
 * - Genérico: funciona com qualquer tipo de dado (T)
 * - Reutilizável: usado em todas as páginas de listagem (Pessoas, Categorias, Transações)
 * - Responsável: exibe estados de loading e empty
 * - Flexível: permite renderização customizada de células através da prop render
 * 
 * Segue os princípios:
 * - DRY (Don't Repeat Yourself): evita duplicação de código de tabela
 * - Single Responsibility: apenas responsável por exibir dados em formato de tabela
 * 
 * @template T Tipo do item de dados que será exibido na tabela.
 */
export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "Nenhum item encontrado",
  loadingMessage = "Carregando...",
  getRowKey,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        {/* Cabeçalho da tabela: renderiza os headers definidos nas colunas */}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Estado de loading: exibido quando está carregando e não há dados */}
          {loading && data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {loadingMessage}
              </TableCell>
            </TableRow>
          ) : /* Estado vazio: exibido quando não há dados e não está carregando */
          data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : /* Estado com dados: renderiza cada item como uma linha da tabela */
          (
            data.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={column.className}
                  >
                    {/* Se houver função render customizada, usa ela; caso contrário, acessa a propriedade diretamente */}
                    {column.render
                      ? column.render(item)
                      : (item as any)[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

