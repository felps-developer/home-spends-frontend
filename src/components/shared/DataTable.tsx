"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  getRowKey: (item: T) => string | number;
}

/**
 * Componente de tabela reutilizável.
 * Segue o princípio DRY e Single Responsibility.
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
          {loading && data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {loadingMessage}
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={column.className}
                  >
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

