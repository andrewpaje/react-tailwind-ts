/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/ban-types */

import React, { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/router"
import { DataTable, Pill } from "@eco/stratos-components"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  useReactTable,
} from "@tanstack/react-table"
import { format, TDate } from "timeago.js"

import TableHeader from "./TableHeader/TableHeader"
import TableBody from "./TableBody/TableBody"
import { StationData } from "components/station/station.type"

import { Button as ButtonComponent } from "@eco/stratos-components"
interface ReactTableProps {
  data: StationData[]
  tablePage: number
  tablePageLimit: number
  stationLimit: number
  stationFilter: string
  setFlyToLatitude: React.Dispatch<React.SetStateAction<number>>
  setFlyToLongitude: React.Dispatch<React.SetStateAction<number>>
  setFlyToZoomLevel: React.Dispatch<React.SetStateAction<number>>
  setSelectedRow: React.Dispatch<React.SetStateAction<StationData>>
  setShowEditStationModal: React.Dispatch<React.SetStateAction<boolean>>
  setStationURL: React.Dispatch<React.SetStateAction<string>>
  setTablePage: React.Dispatch<React.SetStateAction<number>>
}

export const StationTable = ({
  data,
  tablePage,
  tablePageLimit,
  stationLimit,
  stationFilter,
  setFlyToLatitude,
  setFlyToLongitude,
  setFlyToZoomLevel,
  setSelectedRow,
  setShowEditStationModal,
  setStationURL,
  setTablePage,
}: ReactTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])

  let stationCount = data.length
  const [stationCode, setStationCode] = useState<string>("")

  // Initialize Columns
  const columns: Array<ColumnDef<StationData>> = useMemo(
    () => [
      {
        accessorKey: "station_code",
        header: () => <span>Station Code</span>,
        cell: (info) => {
          let station_code: string | unknown = info.getValue()
          return (
            <div className="justify-left flex w-5 items-center">
              <Pill variant="primary" message={station_code as string} />
            </div>
          )
        },
      },
      {
        accessorKey: "network",
        style: { "white-space": "unset" },
        resize: 20,
        header: () => <span>Network</span>,
        cell: (info) => {
          return (
            <div className="justify-left flex w-20 flex-wrap items-center break-all">
              <p>{String(info.getValue())}</p>
            </div>
          )
        },
      },
      {
        accessorKey: "tags",
        style: { "white-space": "unset" },
        size: 10,
        header: () => (
          <span className="justify-left flex w-52 flex-wrap items-center">
            Tags
          </span>
        ),
        cell: (info) => {
          return (
            <div className="justify-left flex w-52 flex-wrap items-center break-all">
              <p>{JSON.stringify(info.getValue())}</p>
            </div>
          )
        },
      },
      {
        accessorKey: "latitude",
        header: () => (
          <span className="flex items-center justify-center">Latitude</span>
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
        accessorKey: "longitude",
        header: () => (
          <span className="flex items-center justify-center">Longitude</span>
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
        accessorKey: "elevation",
        header: () => (
          <span className="flex items-center justify-center">Elevation</span>
        ),
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              <p>{Number(info.getValue())}</p>
            </div>
          )
        },
      },
      {
        accessorKey: "archived",
        header: () => (
          <span className="flex items-center justify-center">Archived</span>
        ),
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              <p>{Boolean(info.getValue()).toString()}</p>
            </div>
          )
        },
      },
      {
        accessorKey: "last_observation_reported",
        style: { "white-space": "unset" },
        header: () => (
          <span className="flex items-center justify-center">Latest Obs</span>
        ),
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              <p>
                {info.getValue() !== null
                  ? format(info.getValue() as TDate)
                  : ""}
              </p>
            </div>
          )
        },
      },
      {
        Header: "",
        accessorKey: "actions",
        header: () => <span></span>,
        cell: (info) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          return (
            <div>
              <ButtonComponent
                iconName="fa-solid fa-map-location-dot"
                variant="default"
                hideLabel
                onClick={() => {
                  const { latitude, longitude } = info.row.original
                  setFlyToLatitude(Number(latitude))
                  setFlyToLongitude(Number(longitude))
                  setFlyToZoomLevel(Number(process.env.ZOOM_FLY_LEVEL))
                }}
              />
              &nbsp;
              <ButtonComponent
                iconName="fa-solid fa-satellite-dish"
                variant="default"
                hideLabel
                onClick={() => {
                  const { station_code } = info.row.original
                  navigateToDevice(station_code)
                }}
              />
              &nbsp;
              <ButtonComponent
                iconName="fa-solid fa-regular fa-pen-to-square"
                variant="default"
                hideLabel
                onClick={() => {
                  setSelectedRow(info.row.original)
                  setShowEditStationModal(true)
                }}
              />
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Store station code to local storage.
  useEffect(() => {
    localStorage.setItem("stationCode", JSON.stringify(stationCode))
  }, [stationCode])

  // Create method to route to device page.
  const router = useRouter()
  const navigateToDevice = (station_code) => {
    setStationCode(station_code)
    router.push("/devices")
  }

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
    autoResetPageIndex: false,
  })

  return (
    <>
      <DataTable
        id="custom-filtering"
        layout="compact"
        pageCount={
          (Math.floor(tablePage / tablePageLimit) + 1) *
            Math.ceil(stationCount / 5) +
          1
        }
        pageIndex={tablePage}
        onPrevPage={() => {
          setTablePage((prev: number) => prev - 1)
          setStationURL(
            `${stationFilter}offset=${
              Math.floor((tablePage - 1) / tablePageLimit) * stationLimit
            }&limit=${stationLimit}`
          )
          reactTable.setPageIndex((tablePage - 1) % tablePageLimit)
        }}
        onNextPage={() => {
          setTablePage((prev: number) => prev + 1)
          setStationURL(
            `${stationFilter}offset=${
              Math.floor((tablePage + 1) / tablePageLimit) * stationLimit
            }&limit=${stationLimit}`
          )
          reactTable.setPageIndex((tablePage + 1) % tablePageLimit)
        }}
        onGotoPage={(e) => {
          setTablePage(e)
          setStationURL(
            `${stationFilter}offset=${
              Math.floor(e / tablePageLimit) * stationLimit
            }&limit=${stationLimit}`
          )
          reactTable.setPageIndex(e % tablePageLimit)
        }}
      >
        <table>
          <TableHeader reactTable={reactTable} />
          <TableBody reactTable={reactTable} />
        </table>
      </DataTable>
    </>
  )
}

export default StationTable
