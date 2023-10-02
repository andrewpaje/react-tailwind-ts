/* eslint-disable react/display-name */
import Head from "next/head";

import {
  Icon,
  DataTable,
  SearchBar,
  Checkbox,
  PageShell,
  SingleColumnCentered,
} from "@eco/stratos-components";

import React, {
  FC,
  forwardRef,
  MutableRefObject,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  getSortedRowModel,
  FilterFn,
  SortingState,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

export default function DatatablePage() {
  // Step 1: Getting your data
  const columns: Array<ColumnDef<unknown, any>> = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        Header: "Name",
        accessorKey: "name",
        header: () => <span className="w-52">Name</span>,
        cell: (info) => info.getValue(),
      },
      {
        Header: "Title",
        accessorKey: "title",
        header: () => <span>Title</span>,
        cell: (info) => info.getValue(),
        size: 500,
      },
      {
        Header: "Email",
        accessorKey: "email",
        header: () => <span>Email</span>,
        cell: (info) => info.getValue(),
      },
      {
        Header: "Role",
        accessorKey: "role",
        header: () => <span>Role</span>,
        cell: (info) => info.getValue(),
      },
      {
        Header: "",
        accessorKey: "actions",
        header: () => <span></span>,
        cell: (info) => info.getValue(),
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const buttonActions = (
    <div className="flex flex-row">
      <span className="px-1">
        <Icon icon="fa-light fa-pencil" size="xs" aria-hidden="true" />
      </span>
      <span className="pl-2 pr-4">
        <Icon icon="fa-light fa-trash" size="xs" aria-hidden="true" />
      </span>
    </div>
  );

  const data = useMemo(
    () => [
      {
        name: "Lindsay Walton",
        title: "Front-end Developer",
        email: "lindsay.walton@example.com",
        role: "Member",
        actions: buttonActions,
      },
      {
        name: "Courtney Henry",
        title: "Designer",
        email: "courtney.henry@example.com",
        role: "Admin",
        actions: buttonActions,
      },
      {
        name: "Tom Cook",
        title: "Director, Product Development",
        email: "tom.cook@example.com",
        role: "Member",
        actions: buttonActions,
      },
      {
        name: "Whitney Francis",
        title: "Copywriter",
        email: "whitney.francis@example.com",
        role: "Admin",
        actions: buttonActions,
      },
      {
        name: "Leonard Krasner",
        title: "Senior Designer",
        email: "leonard.krasner@example.com",
        role: "Owner",
        actions: buttonActions,
      },
      {
        name: "Floyd Miles",
        title: "Principal Designer",
        email: "floy.dmiles@example.com",
        role: "Member",
        actions: buttonActions,
      },
      {
        name: "Emily Selman",
        title: "VP, User Experience",
        email: "emily.selman@example.com",
        role: "Member",
        actions: buttonActions,
      },
      {
        name: "Kristin Watson",
        title: "VP, Human Resources",
        email: "kristin.watson@example.com",
        role: "Admin",
        actions: buttonActions,
      },
      {
        name: "Emma Dorsey",
        title: "Senior Front-end Developer",
        email: "emma.dorsey@example.com",
        role: "Member",
        actions: buttonActions,
      },
      {
        name: "Alicia Bell",
        title: "Junior Copywriter",
        email: "alicia.bell@example.com",
        role: "Admin",
        actions: buttonActions,
      },
      {
        name: "Jenny Wilson",
        title: "Studio Artist",
        email: "jenny.wilson@example.com",
        role: "Owner",
        actions: buttonActions,
      },
      {
        name: "Anna Roberts",
        title: "Partner, Creative",
        email: "anna.roberts@example.com",
        role: "Member",
        actions: buttonActions,
      },
      {
        name: "Benjamin Russel",
        title: "Director, Print Operations",
        email: "benjamin.russel@example.com",
        role: "Member",
        actions: buttonActions,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
    // Rank the item
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      itemRank,
    });

    // Return if the item should be filtered in/out
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return itemRank.passed;
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");

  interface GlobalFilterProps {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  }

  const DebouncedInput: FC<
    GlobalFilterProps & Omit<React.HTMLAttributes<HTMLInputElement>, "onChange">
  > = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);

      return () => clearTimeout(timeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <div className="w-56">
        <SearchBar
          id="globalSearch"
          name="GlobalSearch"
          label="global search"
          hideLabel
          {...props}
          value={value.toString()}
          onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        />
      </div>
    );
  };

  interface IIndeterminateInputProps {
    indeterminate?: boolean;
    value?: string;
  }

  // eslint-disable-next-line react/display-name
  const IndeterminateCheckbox = forwardRef<
    HTMLInputElement,
    IIndeterminateInputProps
  >(({ indeterminate, value, ...rest }, ref: Ref<HTMLInputElement>) => {
    const defaultRef = useRef(null);
    const resolvedRef = ref ?? defaultRef;

    useEffect(() => {
      const mutableRef = resolvedRef as MutableRefObject<HTMLInputElement>;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
      if (mutableRef?.current) {
        mutableRef.current.indeterminate = indeterminate ?? false;
      }
    }, [resolvedRef, indeterminate]);

    return (
      <Checkbox
        hideLabel
        label="rowSelection"
        value={Math.random().toString()}
        onChange={() => void 0}
        {...rest}
      />
    );
  });

  const reactTable = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      sorting,
      rowSelection,
    },
    // Pipeline
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // debugTable: true,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <React.Fragment>
      <Head>
        <title>Eco - Starter Kit Homepage</title>
      </Head>

      <PageShell>
        <SingleColumnCentered>
          <div className="px-10">
            <DataTable
              id="datatable-v8"
              layout="compact"
              pageCount={reactTable.getPageCount()}
              pageIndex={reactTable.getState().pagination.pageIndex}
              onPrevPage={() => reactTable.previousPage()}
              onNextPage={() => reactTable.nextPage()}
              onGotoPage={(e) => reactTable.setPageIndex(e)}
            >
              <div className="mb-5 mt-2">
                <DebouncedInput
                  value={globalFilter}
                  onChange={(value) => setGlobalFilter(value as string)}
                  placeholder="Search all columns..."
                />
              </div>
              <table>
                <thead>
                  {reactTable.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            onClick={header.column.getToggleSortingHandler()}
                            style={{ width: header.getSize() }}
                          >
                            <div
                              className={
                                header.column.getCanSort()
                                  ? "cursor-pointer"
                                  : ""
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}{" "}
                              {{
                                asc: (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline-block h-4 w-4 align-middle"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    aria-labelledby="chevron up icon"
                                    style={{ width: "14px", height: "14px" }}
                                  >
                                    <title>Chevron Up Icon</title>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                ),
                                desc: (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline-block h-4 w-4 align-middle"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    aria-labelledby="chevron down icon"
                                    style={{ width: "14px", height: "14px" }}
                                  >
                                    <title>Chevron Down Icon</title>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {reactTable.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </DataTable>
          </div>
        </SingleColumnCentered>
      </PageShell>
    </React.Fragment>
  );
}
