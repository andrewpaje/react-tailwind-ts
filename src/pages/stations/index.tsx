import React, { useState, useEffect } from "react"
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"

import { getSession } from "@eco/stratos-auth"
import { Disclosure, Spinner, Button as ButtonComponent,} from "@eco/stratos-components"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

import Router from "next/router"
import { useFetch } from "hooks/useFetch"
import { performUpdate } from "hooks/useUpdateData"
import { StationMap } from "features/map/components/map"
import PageTemplate from "components/layout/PageTemplate"
import { StationData } from "components/station/station.type"
import { NetworkData } from "components/network/network.type"
import { MainContextProvider } from "components/context/MainContext"
import { StationEditModal } from "components/modals/StationEditModal"
import StationTable from "components/station/StationTable/StationTable"
import { DataNotification } from "components/notification/DataNotification"
import { StationFilter } from "components/station/StationFilter"

export interface PageType {
  accessToken: string
}

const StationPage: NextPage<PageType> = (props: PageType) => {
  // Data fetching
  const { accessToken } = props
  const [tablePage, setTablePage] = useState<number>(0)
  const [tablePageLimit, setTablePageLimit] = useState<number>(40)
  const [stationLimit, setStationLimit] = useState<number>(200)
  const [stationFilter, setStationFilter] =
    useState<string>("/api/v1/stations?")
  const [stationURL, setStationURL] = useState<string>(
    `${stationFilter}offset=0&limit=${stationLimit}`
  )
  const [stationUpdateURL, setStationUpdateURL] = useState<string>("")
  const { data: networks, isLoading: networksIsLoading } = useFetch(
    "/api/v1/datasources",
    accessToken
  )
  const {
    data: stations,
    isLoading: stationsIsLoading,
    mutate: stationMutate,
  } = useFetch(stationURL, accessToken)

  // Map Fly To states.
  const [flyToLatitude, setFlyToLatitude] = useState<number>(0)
  const [flyToLongitude, setFlyToLongitude] = useState<number>(0)
  const [flyToZoomLevel, setFlyToZoomLevel] = useState<number>(0)

  // Fields to manipulate
  const [selectedStationID, setSelectedStationID] = useState<string>("")
  const [selectedLatitude, setSelectedLatitude] = useState<number>(0)
  const [selectedLongitude, setSelectedLongitude] = useState<number>(0)
  const [selectedElevation, setSelectedElevation] = useState<number>(0)
  const [showEditStationModal, setShowEditStationModal] =
    useState<boolean>(false)
  const [selectedStationCode, setSelectedStationCode] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string>("")
  const [selectedRow, setSelectedRow] = useState<StationData>()

  useEffect(() => {
    if (selectedRow !== undefined) {
      setSelectedStationID(selectedRow.station_id)
      setSelectedLatitude(Number(selectedRow.latitude))
      setSelectedLongitude(Number(selectedRow.longitude))
      setSelectedElevation(Number(selectedRow.elevation))
      setSelectedStationCode(selectedRow.station_code)
      setSelectedTags(JSON.stringify(selectedRow.tags))
    }
  }, [selectedRow])

  const updateStationInfo = async () => {
    if (selectedRow !== undefined) {
      const updatedStationInfo: StationData = {
        station_id: selectedRow.station_id,
        station_code: selectedRow.station_code,
        network: selectedRow.network,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tags: JSON.parse(selectedTags),
        latitude: String(selectedLatitude),
        longitude: String(selectedLatitude),
        elevation: String(selectedElevation),
        archived: selectedRow.archived,
        last_observation_reported: selectedRow.last_observation_reported,
      }

      await performUpdate([stationUpdateURL, accessToken])
      void stationMutate({ ...(stations as StationData[]), updatedStationInfo })
    }
  }

  const ResetFilter = () => {
    setTablePage(0)
    setStationLimit(200)
    setTablePageLimit(40)
    setStationFilter("/api/v1/stations?")
    setStationURL("/api/v1/stations?offset=0&limit=200")
  }

  return (
    <MainContextProvider>
      <PageTemplate title="Stations">
        <div>
          <Disclosure
            list={[
              {
                id: "stationMap",
                label: "Map",
                panel: (
                  <>
                    {
                      // Check if fetch network value is empty after fetched.
                      !Array.isArray(networks) && !networksIsLoading ? (
                        <DataNotification
                          banner_type="error"
                          message="Unable to fetch list of network."
                        />
                      ) : (
                        <></>
                      )
                    }
                    <StationMap
                      networks={networks as NetworkData[] | undefined}
                      stations={stations as StationData[] | undefined}
                      flyToLatitude={flyToLatitude}
                      flyToLongitude={flyToLongitude}
                      flyToZoomLevel={flyToZoomLevel}
                      stationsIsLoading={stationsIsLoading}
                      setStationURL={setStationURL}
                      setTablePage={setTablePage}
                      setStationLimit={setStationLimit}
                      setTablePageLimit={setTablePageLimit}
                      setStationFilter={setStationFilter}
                      setSelectedTags={setSelectedTags}
                      setSelectedLatitude={setSelectedLatitude}
                      setSelectedLongitude={setSelectedLongitude}
                      setSelectedElevation={setSelectedElevation}
                      setSelectedStationID={setSelectedStationID}
                      setSelectedStationCode={setSelectedStationCode}
                      setShowEditStationModal={setShowEditStationModal}
                      setFlyToLatitude={setFlyToLatitude}
                      setFlyToLongitude={setFlyToLongitude}
                      setFlyToZoomLevel={setFlyToZoomLevel}
                    />
                  </>
                ),
                defaultOpen: true,
              },
              {
                id: "stationInformationList",
                label: "List",
                panel:
                  !stationsIsLoading && Array.isArray(stations) ? (
                    <>
                      <StationFilter
                        setStationURL={setStationURL}
                        setStationFilter={setStationFilter}
                        setTablePage={setTablePage}
                        setStationLimit={setStationLimit}
                        setTablePageLimit={setTablePageLimit}
                      />
                      <StationTable
                        data={stations as StationData[]}
                        tablePage={tablePage}
                        tablePageLimit={tablePageLimit}
                        stationLimit={stationLimit}
                        stationFilter={stationFilter}
                        setFlyToLatitude={setFlyToLatitude}
                        setFlyToLongitude={setFlyToLongitude}
                        setFlyToZoomLevel={setFlyToZoomLevel}
                        setSelectedRow={setSelectedRow}
                        setShowEditStationModal={setShowEditStationModal}
                        setStationURL={setStationURL}
                        setTablePage={setTablePage}
                      />
                    </>
                  ) : (
                    !stationsIsLoading && !Array.isArray(stations) ? (
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
                    )
                  ),
                defaultOpen: true,
              },
            ]}
          />
          {selectedLatitude !== 0 &&
          selectedLongitude !== 0 &&
          selectedElevation !== 0 ? (
            <StationEditModal
              selectedTags={selectedTags}
              latitude={selectedLatitude}
              longitude={selectedLongitude}
              elevation={selectedElevation}
              selectedStationID={selectedStationID}
              selectedStationCode={selectedStationCode}
              showEditStationModal={showEditStationModal}
              setLatitude={setSelectedLatitude}
              setSelectedTags={setSelectedTags}
              setLongitude={setSelectedLongitude}
              setElevation={setSelectedElevation}
              setStationUpdateURL={setStationUpdateURL}
              setShowEditStationModal={setShowEditStationModal}
              updateStationInfo={updateStationInfo}
            />
          ) : (
            <></>
          )}
        </div>
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

export default withPageAuthRequired(StationPage)
