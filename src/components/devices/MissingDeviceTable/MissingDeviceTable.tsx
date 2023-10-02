import React, { useMemo, useState, useContext, useEffect } from "react";
import { Pill, DataTable, Select, Input, useWizard } from "@eco/stratos-components";
import { ColumnDef, FilterFn, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { MissingDeviceContext } from 'components/context/MissingDeviceContext';
import { MissingDevicesProps } from "../Wizard/AddDeviceWizard";
import { MissingDeviceRow } from "pages/devices/add";

const MissingDeviceTable = (missing_devices: MissingDeviceRow[]) => {
    const missingDeviceContext = useContext(MissingDeviceContext)


    let [searchString, setSearchString] = useState<string>("");
    let [searchStatus, setSearchStatus] = useState<string>("all");
    const [{ currentStep }, { incrementCurrentStep, markCompleted }] = useWizard()

    const columns: Array<ColumnDef<MissingDeviceRow>> = useMemo(
        () => [
            {
                enableHiding: true,
                accessorKey: "id",
                cell: (info) => info.getValue(),
            },
            {
            Header: "Network",
            accessorKey: "data_source_id",
            header: () => <span>Network</span>,
            cell: (info) => info.getValue(),
            },
            {
            Header: "SourceDeviceID",
            accessorKey: "device_id",
            header: () => <span>Source Device ID</span>,
            cell: (info) => info.getValue(),
            },
            {
            Header: "SourceStationID",
            accessorKey: "station_id",
            header: () => <span>Source Station ID</span>,
            cell: (info) => info.getValue(),
            },
            ],
            [],
        );


    const data: MissingDeviceRow[] = useMemo(
        () => missingDeviceContext?.missingDeviceRecords,
    [missingDeviceContext?.missingDeviceRecords],
    );

    let filteredData = useMemo(() => {
        let results: MissingDeviceRow[] = [];

        if (data.length > 0) {
            data.forEach((m) => {
                if (searchStatus == "data_source_id" || searchStatus == "all") {
                    if (m.data_source_id.toLowerCase().includes(searchString.toLowerCase())) {
                        results = [...results, m];
                    }
                }
                if (searchStatus == "device_id" || searchStatus == "all") {
                    if (m.device_id.toLowerCase().includes(searchString.toLowerCase())) {
                        results = [...results, m];
                    }
                }
                if (searchStatus == "station_id" || searchStatus == "all") {
                    if (m.station_id.toLowerCase().includes(searchString.toLowerCase())) {
                        results = [...results, m];
                    }
                }
            });
        }

        if (searchStatus === "active") {
            return results.filter(
            (d, index) => results.indexOf(d) === index,
            );
        } else if (searchStatus === "inactive") {
            return results.filter(
            (d, index) => results.indexOf(d) === index,
            );
        }
        return results.filter((c, index) => results.indexOf(c) === index);
    }, [data, searchString, searchStatus]);

    const statusChanged = (e: Event) => {
    setSearchStatus((e.target as HTMLSelectElement).value);
    };

    const keywordSearch = (keyword: string) => {
    setSearchString(keyword);
    };

    const [sorting, setSorting] = useState<SortingState>([]);

    const fuzzyFn: FilterFn<unknown> = () => {
    return false;
    }

    // const SelectedMissingDevice = (e) => {
    //     missingDeviceContext.e.target
    // }

    const reactTable = useReactTable({
    data: filteredData,
    columns,
    state: {
        sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: {
        pageIndex: 0,
        pageSize: 5,
        },
        columnVisibility: {'id': false},
    },
    filterFns: { fuzzy: fuzzyFn },
    });

    return (
        <div>
            <div className="flex py-5">
                <span className="pr-5">
                    <Select
                    id="status"
                    label="Status"
                    name="status"
                    options={[
                        { label: "All", value: "all" },
                        { label: "Network", value: "data_source_id" },
                        { label: "Source Device ID", value: "device_id" },
                        { label: "Source Station ID", value: "station_id" },
                    ]}
                    onChange={(e) => statusChanged(e)}
                    selected={searchStatus ? searchStatus.toString() : null}
                    />
                    </span>
                <span>
                    <Input
                    label="Keyword"
                    name="keyword"
                    placeholder="Search"
                    onChange={(event) =>
                        keywordSearch((event.target as HTMLInputElement).value)
                    }
                    value={searchString}
                    />
                </span>
            </div>

            <DataTable
                id="custom-filtering"
                layout="compact"
                pageCount={reactTable.getPageCount()}
                pageIndex={reactTable.getState().pagination.pageIndex}
                onPrevPage={() => reactTable.previousPage()}
                onNextPage={() => reactTable.nextPage()}
                onGotoPage={(e) => reactTable.setPageIndex(e)}
            >
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
                                    header.column.getCanSort() ? "cursor-pointer" : ""
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
                        <tr key={row.id} className="hover:cursor-pointer" onClick={() => {
                            missingDeviceContext?.setMissingDeviceRecordId(row.original.id)
                            missingDeviceContext?.setDataSourceId(row.original.data_source_id)
                            missingDeviceContext?.setSourceDeviceId(row.original.device_id)
                            missingDeviceContext?.setSourceStationId(row.original.station_id)
                            incrementCurrentStep()
                            markCompleted(currentStep)
                        }}>
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
    )
}

export default MissingDeviceTable