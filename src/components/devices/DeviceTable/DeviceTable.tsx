/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/ban-types */

import React, { useState, useMemo } from "react"
import {
  DataTable,
  Button as ButtonComponent,
  Pill,
  Toggle,
} from "@eco/stratos-components"
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import TableHeader from "./TableHeader/TableHeader"
import TableBody from "./TableBody/TableBody"

import { DeviceData } from "components/devices/types"
import { format, TDate } from "timeago.js"

interface ReactTableProps {
  data: DeviceData[];
  TablePageCount: number;
  setDeviceURL: React.Dispatch<React.SetStateAction<string>>;
  tableIndex: number;
  setTableIndex: React.Dispatch<React.SetStateAction<number>>;
  ignoreCount: boolean;
  setIgnoreCount: React.Dispatch<React.SetStateAction<boolean>>;
  setToEditDevice: React.Dispatch<React.SetStateAction<DeviceData>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedStationCode: React.Dispatch<React.SetStateAction<string>>;
  setSelectedStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeviceTable = ({
  data,
  TablePageCount,
  setDeviceURL,
  tableIndex,
  setTableIndex,
  ignoreCount,
  setIgnoreCount,
  setToEditDevice,
  setShowEditModal,
  setSelectedStationCode,
  setSelectedStatus,
}: ReactTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<DeviceData>[]>(
    () => [
      {
        enableHiding: false,
        accessorKey: "record_id",
        cell: (info) => info.getValue(),
      },
      {
        Header: "Network",
        accessorKey: "network",
        header: () => <span>Network</span>,
        cell: (info) => info.getValue(),
      },
      {
        Header: "StationCode",
        accessorKey: "station_code",
        header: () => (
          <span className="flex w-auto justify-center">Station Code</span>
        ),
        cell: (info) => {
          let station_code: string | unknown = info.getValue()
          return (
            <div className="flex items-center justify-center">
              <Pill variant="primary" message={station_code as string} />
            </div>
          )
        },
      },
      {
        Header: "SourceDeviceID",
        accessorKey: "source_device_id",
        header: () => (
          <span className="flex w-auto justify-center">Source Device ID</span>
        ),
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              <p>{info.getValue()}</p>
            </div>
          )
        },
      },
      {
        Header: "SourceStationID",
        accessorKey: "source_station_id",
        header: () => (
          <span className="flex w-auto justify-center">Source Station ID</span>
        ),
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              <p>{info.getValue()}</p>
            </div>
          )
        },
      },
      {
        Header: "Latitude",
        accessorKey: "latitude",
        header: () => <span className="flex w-auto justify-end">Latitude</span>,
        cell: (info) => {
          return (
            <div className="items-right flex justify-end">
              <p>{info.getValue()}</p>
            </div>
          )
        },
      },
      {
        Header: "Longitude",
        accessorKey: "longitude",
        header: () => (
          <span className="flex w-auto justify-end">Longitude</span>
        ),
        cell: (info) => {
          return (
            <div className="items-right flex justify-end">
              <p>{info.getValue()}</p>
            </div>
          )
        },
      },
      {
        Header: "Status",
        accessorKey: "active",
        header: () => (
          <span className="flex w-auto justify-center">Status</span>
        ),
        cell: (info) => {
          const device_status = info.getValue() as boolean

          return (
            <div className="flex items-center justify-center">
              <Toggle
                id="deviceStatusToggle"
                name="offDefault"
                label=""
                disabled={true}
                checked={device_status}
              />
            </div>
          )
        },
      },
      {
        Header: "LastModified",
        accessorKey: "update_datetime",
        header: () => <span>Last Modified</span>,
        cell: (info) => format(info.getValue() as TDate),
      },
      {
        Header: "",
        accessorKey: "actions",
        header: () => <span></span>,
        cell: ({ row }: { row }): JSX.Element => {
          return (
            <ButtonComponent
              iconName="fa-solid fa-pencil"
              variant="subtle-default"
              hideLabel
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const device = row.original as DeviceData
                setSelectedStationCode(device.station_code)
                setSelectedStatus(device.active as boolean)

                setToEditDevice({
                  record_id: device.record_id,
                  source_station_id: device.source_station_id,
                  source_device_id: device.source_device_id,
                  active: device.active,
                  update_datetime: device.update_datetime,
                  geolocation_id: device.geolocation_id,
                  dtn_station_id_v2: device.dtn_station_id_v2,
                  last_updated_by: device.last_updated_by,
                  station_code: device.station_code,
                  latitude: device.latitude,
                  longitude: device.longitude,
                  network: device.network,
                  username: device.username,
                } as DeviceData)

                setShowEditModal(true)
              }}
            />
          )
        },
        enableSorting: false,
        size: 50,
      },
    ],
    []
  )

  const reactTable = useReactTable({
    data,
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
      columnVisibility: { record_id: false },
    },
  })

  const updateDeviceData = () => {
    setIgnoreCount(false)
    setDeviceURL(`/api/v1/devices?offset=${String(tableIndex)}`)
  }

  return (
    <>
      <DataTable
        id="custom-filtering"
        layout="compact"
        pageCount={
          ignoreCount ? data.length / 5 : Math.round(TablePageCount / 5)
        }
        pageIndex={tableIndex}
        onPrevPage={() => {
          setTableIndex((prev) => prev - 1)
          reactTable.previousPage()
          updateDeviceData()
        }}
        onNextPage={() => {
          setTableIndex((prev) => prev + 1)
          reactTable.nextPage()
          updateDeviceData()
        }}
        onGotoPage={(e) => {
          setTableIndex(e)
          reactTable.setPageIndex(e)
          updateDeviceData()
        }}
      >
        <table>
          <TableHeader reactTable={reactTable} />
          <TableBody reactTable={reactTable} />
        </table>
      </DataTable>
      {/* <DeviceEditModal /> */}
    </>
  )
}

export default DeviceTable
