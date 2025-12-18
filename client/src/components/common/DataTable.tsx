import React, { useEffect, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PaginationButton from "@/components/ui/PaginationButton";
import {
  tableContainer,
  tableBase,
  tableHead,
  tableRowHover,
} from "@/styles/twClasses";

interface DataTableProps<T extends object> {
  data: T[];
  columns: any[];
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >;
  totalCount: number;
  isError?: boolean;
  errorText?: string;
  sorting?: { id: string; desc: boolean }[];
  setSorting?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean }[]>
  >;
}

const DataTable = <T extends object>({
  data,
  columns,
  pagination,
  setPagination,
  totalCount,
  isError,
  errorText = "Error loading data",
  sorting = [],
  setSorting = () => {},
}: DataTableProps<T>) => {
  const [isMobile, setIsMobile] = useState(false);

  const mountedRef = useRef(false);
  const initRef = useRef(true);
  const lastPropPaginationRef = useRef(pagination);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    lastPropPaginationRef.current = pagination;
  }, [pagination]);

  const safeSetPagination = (updater: any) => {
    const prev = lastPropPaginationRef.current;
    const next =
      typeof updater === "function" ? updater(prev) : { ...prev, ...updater };

    const same =
      prev &&
      typeof prev.pageIndex === "number" &&
      typeof prev.pageSize === "number" &&
      prev.pageIndex === next.pageIndex &&
      prev.pageSize === next.pageSize;

    if (initRef.current && same) {
      lastPropPaginationRef.current = next;
      return;
    }

    setPagination(next);
    lastPropPaginationRef.current = next;
  };

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(1, Math.ceil(totalCount / pagination.pageSize)),
    state: {
      pagination,
      sorting: Array.isArray(sorting) ? [...sorting] : [],
    },
    onPaginationChange: safeSetPagination,
    onSortingChange: (updater) => {
      let newSorting: { id: string; desc: boolean }[] = [];

      if (typeof updater === "function") {
        try {
          const result = updater(Array.isArray(sorting) ? sorting : []);
          newSorting = Array.isArray(result) ? result : [];
        } catch {
          newSorting = [];
        }
      } else if (Array.isArray(updater)) {
        newSorting = updater;
      }

      if (typeof setSorting === "function") {
        const currentSorting = Array.isArray(sorting) ? sorting : [];
        const changed =
          JSON.stringify(currentSorting) !== JSON.stringify(newSorting);

        setSorting([...newSorting]);

        if (mountedRef.current && changed) {
          safeSetPagination((p: any) => ({ ...p, pageIndex: 0 }));
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    mountedRef.current = true;
    const t = window.setTimeout(() => {
      initRef.current = false;
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (Array.isArray(sorting)) {
      try {
        table.setSorting(sorting);
      } catch {}
    }
  }, [JSON.stringify(sorting)]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pagination.pageSize));
  const startRecord =
    totalCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const endRecord = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    totalCount
  );

  const getVisiblePages = () => {
    const total = totalPages;
    const current = pagination.pageIndex;
    const maxVisible = 5;
    const pages: (number | string)[] = [];

    if (total <= maxVisible + 2) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      const showLeftEllipsis = current > 2;
      const showRightEllipsis = current < total - 3;
      const start = Math.max(1, current - 1);
      const end = Math.min(total - 2, current + 1);

      pages.push(0);
      if (showLeftEllipsis) pages.push("…");

      for (let i = start; i <= end; i++) {
        if (i < total - 1) pages.push(i);
      }

      if (showRightEllipsis) pages.push("…");
      pages.push(total - 1);
    }

    return pages;
  };

  return (
    <div className="relative">
      <div className={tableContainer}>
        <table className={tableBase}>
          <thead className={tableHead}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      onClick={
                        canSort ? header.column.getToggleSortingHandler() : undefined
                      }
                      className={`px-4 py-3 select-none ${
                        canSort ? "cursor-pointer hover:text-[#3C50E0]" : ""
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {canSort && (
                          <>
                            {sorted === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[#3C50E0]" />
                            ) : sorted === "desc" ? (
                              <ArrowDown className="w-3.5 h-3.5 text-[#3C50E0]" />
                            ) : (
                              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody
            className="divide-y divide-gray-100 dark:divide-white/[0.05]"
            style={{ minHeight: pagination.pageSize * 55 }}
          >
            {isError ? (
              <tr>
                <td colSpan={columns.length} className="py-5 text-center">
                  {errorText}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-5 text-center">
                  No records found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={tableRowHover}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {startRecord}-{endRecord} of {totalCount}
        </p>

        {/* PAGE SIZE SELECTOR */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-300">Rows:</span>
          <select
            value={pagination.pageSize}
            onChange={(e) =>
              safeSetPagination((prev: any) => ({
                ...prev,
                pageIndex: 0,
                pageSize: Number(e.target.value),
              }))
            }
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm rounded-md px-2 py-1"
          >
            {[5, 8, 10, 20, 50].map((size) => (
              <option
                key={size}
                value={size}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                {size}
              </option>
            ))}
          </select>
        </div>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <PaginationButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </PaginationButton>

            <select
              value={pagination.pageIndex}
              onChange={(e) =>
                safeSetPagination((p: any) => ({
                  ...p,
                  pageIndex: Number(e.target.value),
                }))
              }
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm rounded-md px-2 py-1"
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option
                  key={i}
                  value={i}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  Page {i + 1}
                </option>
              ))}
            </select>

            <PaginationButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </PaginationButton>
          </div>
        ) : (
          <nav className="flex items-center gap-1 flex-wrap">
            <PaginationButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </PaginationButton>

            {getVisiblePages().map((p, idx) =>
              typeof p === "number" ? (
                <PaginationButton
                  key={idx}
                  active={pagination.pageIndex === p}
                  onClick={() =>
                    safeSetPagination((prev: any) => ({
                      ...prev,
                      pageIndex: p,
                    }))
                  }
                >
                  {p + 1}
                </PaginationButton>
              ) : (
                <span
                  key={`dots-${idx}`}
                  className="px-2 text-gray-400 select-none"
                >
                  {p}
                </span>
              )
            )}

            <PaginationButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <ChevronRight className="w-4 h-4" />
            </PaginationButton>
          </nav>
        )}
      </div>
    </div>
  );
};

export default DataTable;
