import React, { useState } from "react"
import { useRouter } from "next/router"
import {
  Select,
  Input,
  Button as ButtonComponent,
} from "@eco/stratos-components"

interface Props {
  setDeviceURL: React.Dispatch<React.SetStateAction<string>>;
  setIgnoreCount: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DeviceFilter = ({ setDeviceURL, setIgnoreCount }: Props) => {
  const [searchString, setSearchString] = useState<string>("")
  const [searchField, setSearchField] = useState<string>("stationcode")

  const statusChanged = (e: HTMLSelectElement) => {
    setSearchField(e.value)
  }

  const ClearTable = () => {
    setSearchString("")
    setDeviceURL("/api/v1/devices")
  }

  const FilterTable = () => {
    if (searchString === "") {
      setIgnoreCount(false)
      setDeviceURL("/api/v1/devices")
    } else if (searchField === "stationcode") {
      setIgnoreCount(true)
      setDeviceURL(`/api/v1/devices?station_code=${searchString}`)
    } else if (searchField === "network") {
      setDeviceURL(`/api/v1/devices?data_source=${searchString}`)
    }
  }

  const router = useRouter()

  const gotoDevice = () => {
    router.push("/devices/add")
  }

  return (
    <div className="flex">
      <span className="pr-5">
        <Select
          id="field"
          label="Field"
          name="field"
          options={[
            { label: "Station Code", value: "stationcode" },
            { label: "Network", value: "network" },
          ]}
          onChange={(event) => statusChanged(event.target as HTMLSelectElement)}
          selected={searchField ? searchField.toString() : null}
        />
      </span>
      <span>
        <Input
          label="Value"
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
      <span className="flex-row justify-end space-x-1 md:flex md:flex-grow">
        <ButtonComponent
          iconName="fa-sharp fa-regular fa-plus-large"
          variant="primary"
          onClick={() => gotoDevice()}
        >
          Add
        </ButtonComponent>
      </span>
    </div>
  )
}
