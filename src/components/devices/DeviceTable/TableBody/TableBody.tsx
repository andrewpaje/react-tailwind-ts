import React from "react";
import { flexRender } from "@tanstack/react-table";

const TableBody = ({ reactTable }) => {
  return (
    <tbody>
        { reactTable.getRowModel().rows.map((row) => {
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
            })
        }
    </tbody>
  )
}

export default TableBody