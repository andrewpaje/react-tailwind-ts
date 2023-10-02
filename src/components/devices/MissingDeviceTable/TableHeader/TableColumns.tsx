// import React, { useMemo } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import { IDevice } from "components/devices/types";
// import { Icon } from "@eco/stratos-components";
// import {format, TDate} from "timeago.js"

// export const TableColumn = useMemo<ColumnDef<IDevice>[]>(
//     () => [
//         {
//             enableHiding: false,
//             accessorKey: "record_id",
//             cell: (info) => info.getValue(),
//         },
//         {
//         Header: "",
//         accessorKey: "actions",
//         header: () => <span></span>,
//         cell: () => {
//             return <div className="cursor-pointer">
//                         <Icon id="basic-icon-xxs" icon="fa-solid fa-pencil" size="xs" color="blue" />
//                     </div>
//         },
//         enableSorting: false,
//         size: 50,
//         },
//     ],
//     [],
// )