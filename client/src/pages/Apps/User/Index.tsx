import { PlusCircle, PencilLine, Trash2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/Button";
import DataTable from "@/components/common/DataTable";
import { useListQuery } from "@/hooks/useListQuery";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import moment from "moment";

const List = () => {
  const navigate = useNavigate();

  const {
    data,
    rowCount,
    isError,
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
  } = useListQuery("/user/getusers");

  const { confirmAndDelete } = useDeleteItem(fetchList);

  const columns = [
    { accessorKey: "fullname", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },

    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) =>
        row.original.isActive ? (
          <span className="text-[#219653] bg-[#219653]/10 px-3 py-1 text-xs rounded-full font-medium">
            Active
          </span>
        ) : (
          <span className="text-[#D34053] bg-[#D34053]/10 px-3 py-1 text-xs rounded-full font-medium">
            Inactive
          </span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: any) =>
        moment(row.original.createdAt).format("DD MMM YYYY"),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(`/users/add/${row.original._id}`, {
                state: {
                  pageIndex: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                },
              })
            }
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <PencilLine className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              confirmAndDelete(
                `/user/delete/${row.original._id}`,
                "Record deleted successfully"
              )
            }
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>
      ),
    },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="User Management" />

      <ComponentCard>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">

          <Button onClick={() => navigate("/users/add")}>
            <PlusCircle className="w-4 h-4" /> Add
          </Button>

          <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
            <input
              type="text"
              value={searchInput}
              placeholder="Search..."
              onChange={(e) => {
                setSearchInput(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="w-full rounded-md border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] py-2 pl-9 pr-9 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {!isRestoring && (
          <DataTable
            data={data}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
            totalCount={rowCount}
            isError={isError}
            sorting={sorting}
            setSorting={setSorting}
          />
        )}
      </ComponentCard>
    </>
  );
};

export default List;
