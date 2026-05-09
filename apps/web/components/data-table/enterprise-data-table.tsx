'use client';

import * as React from 'react';
import type { ColumnDef, VisibilityState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Columns3, Download, Search, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/design-system/empty-state';
import { Skeleton } from '@/components/ui/skeleton';

function buildGlobalIncludes<T extends Record<string, unknown>>(): NonNullable<
  Parameters<typeof useReactTable<T>>[0]['globalFilterFn']
> {
  return (row, _columnId, filterValue) => {
    const q = String(filterValue ?? '')
      .trim()
      .toLowerCase();
    if (!q) return true;
    return Object.values(row.original).some((v) =>
      String(v ?? '')
        .toLowerCase()
        .includes(q),
    );
  };
}

export type EnterpriseTableProps<T extends Record<string, unknown>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ColumnDef TValue union is app-specific per table (TanStack accessors infer `string`).
  columns: ColumnDef<T, any>[];
  data: T[];
  getRowId?: (original: T, index: number) => string;
  initialPageSize?: number;
  searchPlaceholder?: string;
  searchable?: boolean;
  columnVisibilityConfigurable?: boolean;
  enableRowSelection?: boolean;
  bulkActionsSlot?: React.ReactNode;
  onExportCsv?: (rows: T[]) => void;
  exportFilename?: string;
  isLoading?: boolean;
  loadingRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tableCaption?: string;
  toolbarExtra?: React.ReactNode;
};

function exportCsv<T extends Record<string, unknown>>(rows: T[], filename: string) {
  const first = rows[0];
  if (!first) return;
  const keys = Object.keys(first);
  const esc = (s: unknown) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const header = keys.map(esc).join(',');
  const body = rows.map((row) => keys.map((k) => esc(row[k])).join(',')).join('\r\n');
  const blob = new Blob([`${header}\r\n${body}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename.replace(/\\.csv$/i, '')}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function EnterpriseDataTable<T extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  initialPageSize = 10,
  searchPlaceholder = 'Search rows…',
  searchable = true,
  columnVisibilityConfigurable = true,
  enableRowSelection = true,
  bulkActionsSlot,
  onExportCsv,
  exportFilename = 'export',
  isLoading,
  loadingRows = 6,
  emptyTitle = 'No records',
  emptyDescription,
  emptyIcon,
  tableCaption,
  toolbarExtra,
}: EnterpriseTableProps<T>) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const globalIncludes = React.useMemo(() => buildGlobalIncludes<T>(), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Checkbox column aligns with heterogeneous ColumnDef TValue from merged columns.
  const selectionColumn = React.useMemo<ColumnDef<T, any>>(() => {
    return {
      id: 'select',
      meta: { label: 'Select' },
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected()
              ? true
              : table.getIsSomeRowsSelected()
                ? 'indeterminate'
                : false
          }
          aria-label="Select all rows on page"
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          aria-label={`Select row ${row.index + 1}`}
          onCheckedChange={(v) => row.toggleSelected(Boolean(v))}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };
  }, []);

  const mergedColumns = React.useMemo(() => {
    const base = [...columns];
    return enableRowSelection ? [selectionColumn, ...base] : base;
  }, [columns, enableRowSelection, selectionColumn]);

  const table = useReactTable({
    data,
    columns: mergedColumns,
    state: { columnVisibility, globalFilter },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: globalIncludes,
    enableRowSelection,
    getRowId,
    initialState: {
      pagination: { pageSize: initialPageSize, pageIndex: 0 },
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = enableRowSelection && selectedRows.length > 0;

  const handleExport = () => {
    const filtered = table.getFilteredRowModel().rows.map((r) => r.original as T);
    const target =
      enableRowSelection && selectedRows.length
        ? (selectedRows.map((r) => r.original as T) as T[])
        : filtered;
    exportCsv(target, exportFilename);
    onExportCsv?.(target);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-xs" aria-busy>
        <Skeleton className="h-10 w-full max-w-xl" />
        <div className="space-y-2">
          {Array.from({ length: loadingRows }).map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const rowModel = table.getRowModel();
  const showFooter = Boolean(rowModel.rows.length);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          {searchable ? (
            <Input
              className="max-w-md"
              value={globalFilter}
              placeholder={searchPlaceholder}
              onChange={(e) => setGlobalFilter(e.target.value)}
              aria-label="Filter table rows"
              suffix={<Search className="size-4 shrink-0 opacity-65" aria-hidden />}
            />
          ) : null}
          {toolbarExtra}
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasSelection}
            onClick={() => table.resetRowSelection()}
          >
            <Trash2 aria-hidden /> Clear{' '}
            {enableRowSelection ? <span aria-hidden>{`(${selectedRows.length})`}</span> : null}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleExport}>
            <Download aria-hidden /> Export CSV
          </Button>
          {columnVisibilityConfigurable ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="secondary" size="sm">
                  <Columns3 aria-hidden /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {table.getAllLeafColumns().map((column) => {
                  if (!column.getCanHide()) return null;
                  const metaLabel =
                    typeof column.columnDef.meta === 'object' &&
                    column.columnDef.meta !== null &&
                    'label' in column.columnDef.meta
                      ? String((column.columnDef.meta as { label?: string }).label ?? '')
                      : '';
                  const label =
                    metaLabel ||
                    (typeof column.columnDef.header === 'string' ? column.columnDef.header : '') ||
                    (column.id === 'select' ? 'Select' : column.id.replace(/-/g, ' '));
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(v) => column.toggleVisibility(Boolean(v))}
                    >
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {bulkActionsSlot && hasSelection ? (
        <div className="flex flex-wrap gap-3 border-b border-border bg-accent-muted px-4 py-3">
          {bulkActionsSlot}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        {!rowModel.rows.length ? (
          <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
        ) : (
          <table className="w-full min-w-[640px] text-left">
            {tableCaption ? <caption className="sr-only">{tableCaption}</caption> : null}
            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm supports-[backdrop-filter]:bg-muted/75">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id} className="border-b border-border">
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 text-caption font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rowModel.rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-border transition-colors hover:bg-muted/50',
                    row.getIsSelected() && 'bg-accent-muted/60',
                  )}
                  aria-selected={enableRowSelection ? row.getIsSelected() : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="break-words px-4 py-3 text-body">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showFooter ? (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="text-caption text-muted-foreground tabular-nums">
            Showing{' '}
            <strong className="font-semibold text-foreground">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </strong>
            –
            <strong className="font-semibold text-foreground">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}
            </strong>{' '}
            of{' '}
            <strong className="font-semibold text-foreground">
              {table.getFilteredRowModel().rows.length}
            </strong>{' '}
            filtered rows · Page{' '}
            {Math.min(table.getState().pagination.pageIndex + 1, table.getPageCount())} /{' '}
            {Math.max(table.getPageCount(), 1)}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </Button>
            <label className="sr-only" htmlFor="page-size-select">
              Rows per page
            </label>
            <select
              id="page-size-select"
              className="h-9 rounded-lg border border-input bg-transparent px-2 text-caption text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((sz) => (
                <option key={sz} value={sz}>
                  {sz} / page
                </option>
              ))}
            </select>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
