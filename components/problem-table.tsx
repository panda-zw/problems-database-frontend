"use client";

import { useState } from "react";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import AddProblemModal from "./add-problem-modal";
import { ProblemSolutionDisplay } from "./problem-solution-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useDebounce } from "@/lib/utils";

interface Problem {
  _id: string;
  problem_name: string;
  sector: string;
  problem_description: string;
  affected_regions: string[];
  solution_name: string;
  solution_description: string;
  technology_used: string[];
  adaptation_required: string;
  examples_in_africa: string[];
}

export default function ProblemsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce((value: string) => {
    setSearch(value);
  }, 300); // 300ms debounce delay

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete problem");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Problem deleted successfully!");
      setProblemToDelete(null);
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete problem.");
      setProblemToDelete(null);
      setIsDialogOpen(false);
    },
  });

  const fetchData = async ({
    queryKey,
  }: {
    queryKey: [string, { page: number; limit: number; search: string }];
  }) => {
    const [_key, { page, limit, search }] = queryKey;
    console.log(_key)
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/problems?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`
    );
    if (!response.ok) throw new Error("Failed to fetch problems");
    return response.json();
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "problems",
      { page: pagination.pageIndex + 1, limit: pagination.pageSize, search },
    ],
    queryFn: fetchData,
  });

  const columns: ColumnDef<Problem>[] = [
    {
      accessorKey: "problem_name",
      header: "Problem Name",
      cell: ({ row }) => (
        <span className="underline cursor-pointer">
          {row.original.problem_name}
        </span>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
    },
    {
      accessorKey: "solution_name",
      header: "Solution Name",
    },
    {
      accessorKey: "adaptation_required",
      header: "Adaptation Required",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setSelectedProblem(row.original); // Set the problem to edit
                  setIsModalOpen(true); // Open the modal
                }}
              >
                Edit
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setProblemToDelete(row.original); // Set the problem to delete
                  setIsDialogOpen(true); // Open confirmation dialog
                }}
              >
                Delete
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.totalPages || 1,
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: data?.total,
  });

  const handleModalSubmitSuccess = () => {
    console.log("Modal submitted successfully");
    refetch();
  };

  const handleRowClick = (problem: Problem) => {
    console.log("Row clicked", problem);
    setSelectedProblem(problem);
    setIsSheetOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          className="max-w-sm"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <Button className="ml-4" onClick={() => setIsModalOpen(true)}>
          Add Problem
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        if (
                          "accessorKey" in cell.column.columnDef &&
                          cell.column.columnDef.accessorKey === "problem_name"
                        ) {
                          handleRowClick(row.original);
                        }
                      }}
                      className={
                        "accessorKey" in cell.column.columnDef &&
                        cell.column.columnDef.accessorKey === "problem_name"
                          ? "cursor-pointer underline"
                          : ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center gap-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
        <span className="flex items-center gap-1">
          <div className="text-sm text-muted-foreground">Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="text-sm text-muted-foreground"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getRowModel().rows.length.toLocaleString()} of{" "}
        {table.getRowCount().toLocaleString()} rows
      </div>
      <AddProblemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProblem(null); // Clear the selected problem after closing
        }}
        problemToEdit={selectedProblem} // Pass the selected problem
        onSubmitSuccess={handleModalSubmitSuccess}
      />

      {/* Sheet Component */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-96 max-w-5xl">
          <SheetHeader>
            <SheetTitle>Problem</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {selectedProblem ? (
              <ProblemSolutionDisplay selectedProblem={selectedProblem} />
            ) : (
              <p>No problem selected.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this problem? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                problemToDelete && deleteMutation.mutate(problemToDelete._id)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
