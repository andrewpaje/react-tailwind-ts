import Router from "next/router"
import React, { useState, useEffect } from "react"
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"

import { getSession } from "@eco/stratos-auth"
import { Spinner, Button as ButtonComponent } from "@eco/stratos-components"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

import { performUpdate } from "hooks/useUpdateData"
import { DeviceData } from "components/devices/types"
import PageTemplate from "components/layout/PageTemplate"
import { useFetchWithCount } from "hooks/useFetchWithCount"
import { DeviceFilter } from "components/devices/DeviceFilter"
import { DeviceEditModal } from "components/modals/DeviceEditModal"
import { MainContextProvider } from "components/context/MainContext"
import DeviceTable from "components/devices/DeviceTable/DeviceTable"
import { DataNotification } from "components/notification/DataNotification"

export interface PageType {
  accessToken: string
}

interface DeviceProps {
  data: DeviceData[]
  count: number
}

const DevicePage: NextPage<PageType> = (props: PageType) => {
  // Data fetching
  const { accessToken } = props

  const [deviceURL, setDeviceURL] = useState<string>("/api/v1/devices")
  const [deviceUpdateURL, setDeviceUpdateURL] = useState<string>("")
  const {
    data,
    isLoading: devicesIsLoading,
    mutate: deviceMutate,
  } = useFetchWithCount(deviceURL, accessToken)
  const [ignoreCount, setIgnoreCount] = useState<boolean>(false)

  const [tableIndex, setTableIndex] = useState<number>(0)
  const [toEditDevice, setToEditDevice] = useState<DeviceData | null>(null)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  // Edit fields
  const [selectedStationCode, setSelectedStationCode] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<boolean>(true)
  const [triggerDeleteLocalStorage, setTriggerDeleteLocalStorage] =
    useState(false)

  // Load station code from local storage - Navigation of stations to devices
  useEffect(() => {
    if (localStorage.getItem("stationCode") !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const stationCode = JSON.parse(localStorage.getItem("stationCode") ?? "")
      if (String(stationCode)) {
        setDeviceURL(`/api/v1/devices?&station_code=${stationCode as string}`)
        setTriggerDeleteLocalStorage((prev) => !prev)
      }
    }
  }, [])

  // Remove stationCode from local storage after use
  useEffect(() => {
    setTimeout(() => {
      if (localStorage.getItem("stationCode") !== null) {
        localStorage.removeItem("stationCode")
      }
    }, 3500)
  }, [triggerDeleteLocalStorage])

  const updateDeviceInfo = async () => {
    if (toEditDevice !== null) {
      const updatedDeviceInfo: DeviceData = {
        record_id: toEditDevice.record_id,
        source_station_id: toEditDevice.source_station_id,
        source_device_id: toEditDevice.source_device_id,
        active: selectedStatus,
        update_datetime: toEditDevice.update_datetime,
        geolocation_id: toEditDevice.geolocation_id,
        dtn_station_id_v2: toEditDevice.dtn_station_id_v2,
        last_updated_by: toEditDevice.last_updated_by,
        station_code: selectedStationCode,
        latitude: toEditDevice.latitude,
        longitude: toEditDevice.longitude,
        network: toEditDevice.network,
        username: toEditDevice.username,
      }

      await performUpdate([deviceUpdateURL, accessToken])
      void deviceMutate({ ...(data as DeviceProps).data, updatedDeviceInfo })
    }
  }

  const ResetFilter = () => {
    setDeviceURL("/api/v1/devices")
  }

  return (
    <MainContextProvider>
      <PageTemplate title="Devices">
        <>
          {/* ---- Device Table Section ---- */}
          {data !== undefined
          && Array.isArray((data as DeviceProps).data)
          && !devicesIsLoading ? (
            <>
              <DeviceFilter
                setDeviceURL={setDeviceURL}
                setIgnoreCount={setIgnoreCount}
              />
              <DeviceTable
                data={(data as DeviceProps).data}
                TablePageCount={(data as DeviceProps).count}
                tableIndex={tableIndex}
                ignoreCount={ignoreCount}
                setDeviceURL={setDeviceURL}
                setTableIndex={setTableIndex}
                setIgnoreCount={setIgnoreCount}
                setToEditDevice={setToEditDevice}
                setShowEditModal={setShowEditModal}
                setSelectedStatus={setSelectedStatus}
                setSelectedStationCode={setSelectedStationCode}
              />
            </>
          ) : !devicesIsLoading
            && !Array.isArray((data as DeviceProps).data)
            && data.hasOwnProperty("data") ? (
            <>
              <div>
                <DataNotification
                  banner_type="error"
                  message="Filter did not yield any result, please click the Clear button and try again."
                />
              </div>
              <div className="py-7 pl-5">
                <ButtonComponent
                  iconName="fa-solid fa-magnifying-glass-minus"
                  onClick={ResetFilter}
                >
                  Clear
                </ButtonComponent>
              </div>
            </>
          ) : (
            <div className="h-100 w-50 flex place-content-center py-10">
              <Spinner size="xxl" />
            </div>
          )}
          {/* ----------------------- */}

          {/* ---- Modal Section ---- */}
          {showEditModal ? (
            <DeviceEditModal
              showEditModal={showEditModal}
              selectedStatus={selectedStatus}
              toEditDevice={toEditDevice as DeviceData}
              selectedStationCode={selectedStationCode}
              setShowEditModal={setShowEditModal}
              setSelectedStatus={setSelectedStatus}
              setDeviceUpdateURL={setDeviceUpdateURL}
              setSelectedStationCode={setSelectedStationCode}
              updateDeviceInfo={updateDeviceInfo}
            />
          ) : (
            <></>
          )}
          {/* ----------------------- */}
        </>
      </PageTemplate>
    </MainContextProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let accessToken: string
  let accessTokenExpiresAt: number
  // Get Session info
  try {
    const result = await getSession(context.req, context.res)
    if (!result) {
      throw new Error("Something went wrong with fetching user session.")
    }
    accessToken = result.accessToken ?? ""
    accessTokenExpiresAt = result.accessTokenExpiresAt ?? 0

    // Check if token is expired and redirect in login page.
    if (
      accessTokenExpiresAt !== 0 &&
      new Date(accessTokenExpiresAt * 1000) <= new Date()
    ) {
      void Router.push("api/auth/login")
    }
  } catch (e) {
    return {
      redirect: {
        destination: `/api/auth/login`,
        permanent: false,
      },
    }
  }
  return { props: { accessToken } }
}

export default withPageAuthRequired(DevicePage)
