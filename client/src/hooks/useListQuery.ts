import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";
import { useApi } from "@/api";
import { useSelector } from "react-redux";

/**
 * Reusable hook for paginated, searchable, and sortable list views.
 *
 * Handles:
 * - Pagination
 * - Sorting
 * - Search (with debounce)
 * - View type (viewAll, viewOwn, self)
 * - Data fetching
 * - State restoration on page reload
 */
export const useListQuery = (endpoint: string) => {
  const api = useApi();
  const location = useLocation();
  const { currentUser } = useSelector((state: any) => state.user);

  const VITE_PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE || 10;

  const [data, setData] = useState<any[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: VITE_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    { id: "", desc: true },
  ]);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const state = (location.state as any) || (window.history?.state?.usr as any);
    if (state && typeof state.pageIndex === "number") {
      setPagination({
        pageIndex: state.pageIndex,
        pageSize: state.pageSize || VITE_PAGE_SIZE,
      });
      try {
        window.history.replaceState({}, document.title);
      } catch {}
    }
    setIsRestoring(false);
  }, [location.state]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }, 400),
    []
  );

  const fetchList = async () => {
    try {
      setLoading(true);
      const sortField = sorting[0]?.id || "createdAt";
      const sortOrder = sorting[0]?.desc ? "desc" : "asc";
      const viewType = "all";
      const ownerId = currentUser?._id || "";

      const res = await api.get(
        `${endpoint}?page=${pagination.pageIndex}&per_page=${pagination.pageSize}&search=${encodeURIComponent(
          search
        )}&sortField=${encodeURIComponent(sortField)}&sortOrder=${encodeURIComponent(
          sortOrder
        )}&viewType=${encodeURIComponent(viewType)}&ownerId=${encodeURIComponent(ownerId)}`
      );

      const json = res.data;
      setData(json.data || []);
      setRowCount(json.totalRowCount || 0);
      setIsError(false);
    } catch (err) {
      console.error("List fetch failed:", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isRestoring) fetchList();
  }, [pagination.pageIndex, pagination.pageSize, search, sorting, isRestoring]);

  const clearSearch = () => {
    setSearch("");
    setSearchInput("");
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  return {
    data,
    rowCount,
    isError,
    loading,
    search,
    searchInput,
    setSearchInput,
    pagination,
    setPagination,
    sorting,
    setSorting,
    isRestoring,
    debouncedSearch,
    clearSearch,
    fetchList,
  };
};
