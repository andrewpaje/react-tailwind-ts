import React, { useState } from "react"
import {
  Select,
  Input,
  Button as ButtonComponent,
} from "@eco/stratos-components"

interface Props {
  setStationURL: React.Dispatch<React.SetStateAction<string>>
  setStationFilter: React.Dispatch<React.SetStateAction<string>>
  setTablePage: React.Dispatch<React.SetStateAction<number>>
  setStationLimit: React.Dispatch<React.SetStateAction<number>>
  setTablePageLimit: React.Dispatch<React.SetStateAction<number>>
}

export const StationFilter = ({
  setStationURL,
  setStationFilter,
  setTablePage,
  setStationLimit,
  setTablePageLimit,
}: Props) => {
  const [searchString, setSearchString] = useState<string>("")
  const [searchField, setSearchField] = useState<string>("stationcode")

  const statusChanged = (e: HTMLSelectElement) => {
    setSearchField(e.value)
  }

  const FilterTable = () => {
    let filter: string = ""
    if (searchString === "") {
      filter = "/api/v1/stations?"
    } else if (searchField === "stationcode") {
      filter = `/api/v1/stations?station_code=${searchString}&`
    } else if (searchField === "network") {
      filter = `/api/v1/stations?data_source=${searchString}&`
    } else if (searchField === "tag") {
      filter = `/api/v1/stations?tag=${searchString}&`
    }
    setTablePage(0)
    setStationLimit(200)
    setTablePageLimit(40)
    setStationFilter(filter)
    setStationURL(`${filter}offset=0&limit=200`)
  }

  const ClearTable = () => {
    setSearchString("")
    setTablePage(0)
    setStationLimit(200)
    setTablePageLimit(40)
    setStationFilter("/api/v1/stations?")
    setStationURL("/api/v1/stations?offset=0&limit=200")
  }

  return (
    <div className="flex">
      <span className="pr-5">
        <Select
          id="Filter"
          label="Filter"
          name="Filter"
          options={[
            { label: "Station Code", value: "stationcode" },
            { label: "Network", value: "network" },
            { label: "Tag", value: "tag" },
          ]}
          onChange={(event) => statusChanged(event.target as HTMLSelectElement)}
          selected={searchField ? searchField.toString() : null}
        />
      </span>
      <span>
        <Input
          label="Keyword"
          name="fieldValue"
          placeholder="Search value..."
          onChange={(event) =>
            setSearchString((event.target as HTMLInputElement).value)
          }
          value={searchString}
        />
      </span>
      <span className="py-7 pl-5">
        <ButtonComponent
          iconName="fa-solid fa-magnifying-glass"
          onClick={FilterTable}
        >
          Search
        </ButtonComponent>
      </span>
      <span className="py-7 pl-5">
        <ButtonComponent
          iconName="fa-solid fa-magnifying-glass-minus"
          onClick={ClearTable}
        >
          Clear
        </ButtonComponent>
      </span>
    </div>
  )
}
