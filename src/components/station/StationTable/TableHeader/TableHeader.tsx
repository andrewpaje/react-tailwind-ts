import React from "react";
import { flexRender } from "@tanstack/react-table";

const TableHeader = ({ reactTable }) => {
    return (
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
                                xmlns="http:www.w3.org/2000/svg"
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
                                xmlns="http:www.w3.org/2000/svg"
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
    )

}

export default TableHeader
