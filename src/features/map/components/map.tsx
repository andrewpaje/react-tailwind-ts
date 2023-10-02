import React, { useRef, useEffect, useState, useMemo } from "react"
import Map, { Marker, Popup, NavigationControl } from "react-map-gl"
import { StationData } from "components/station/station.type"
import { NetworkData } from "components/network/network.type"
import { MarkerPopUp } from "./markerPopup"
import "mapbox-gl/dist/mapbox-gl.css"
import { Autocomplete, AutocompleteOption } from "@eco/stratos-components"
import { MapLayerMouseEvent, Map as MapboxMap } from "mapbox-gl"
import { Button as ButtonComponent } from "@eco/stratos-components"

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN as string

interface Props {
  stations: StationData[] | undefined
  networks: NetworkData[] | undefined
  flyToLatitude: number
  flyToLongitude: number
  flyToZoomLevel: number
  stationsIsLoading: boolean
  setStationURL: React.Dispatch<React.SetStateAction<string>>
  setTablePage: React.Dispatch<React.SetStateAction<number>>
  setStationLimit: React.Dispatch<React.SetStateAction<number>>
  setTablePageLimit: React.Dispatch<React.SetStateAction<number>>
  setStationFilter: React.Dispatch<React.SetStateAction<string>>
  setSelectedTags: React.Dispatch<React.SetStateAction<string>>
  setSelectedLatitude: React.Dispatch<React.SetStateAction<number>>
  setSelectedLongitude: React.Dispatch<React.SetStateAction<number>>
  setSelectedElevation: React.Dispatch<React.SetStateAction<number>>
  setShowEditStationModal: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedStationID: React.Dispatch<React.SetStateAction<string>>
  setSelectedStationCode: React.Dispatch<React.SetStateAction<string>>
  setFlyToLatitude: React.Dispatch<React.SetStateAction<number>>
  setFlyToLongitude: React.Dispatch<React.SetStateAction<number>>
  setFlyToZoomLevel: React.Dispatch<React.SetStateAction<number>>
}

export const StationMap = ({
  stations,
  networks,
  flyToLatitude,
  flyToLongitude,
  flyToZoomLevel,
  stationsIsLoading,
  setStationURL,
  setTablePage,
  setStationLimit,
  setTablePageLimit,
  setStationFilter,
  setSelectedTags,
  setSelectedLatitude,
  setSelectedLongitude,
  setSelectedElevation,
  setSelectedStationID,
  setSelectedStationCode,
  setShowEditStationModal,
  setFlyToLatitude,
  setFlyToLongitude,
  setFlyToZoomLevel,
}: Props) => {
  const [popupInfo, setPopupInfo] = useState<StationData | null>()
  const mapRef = useRef<MapboxMap | null>(null)
  const [IsCircleAdded, setIsCircleAdded] = useState(false)
  const [showRadiusMessage, setShowRadiusMessage] = useState(false)

  const INITIAL_LATITUDE = 45.96682
  const INITIAL_LONGITUDE = -39.610991
  const INITIAL_ZOOM = 1
  const ZOOM_FLY_RADIUS = 5.3
  const CIRCLE_RADIUS = 230

  const handleMapDoubleClick = (event: MapLayerMouseEvent) => {
    event.preventDefault()
    const latitude = event.lngLat.lat
    const longitude = event.lngLat.lng

    if (IsCircleAdded) {
      // Remove the circle and reset the view
      handleResetView()
    } else {
      setFlyToLatitude(latitude)
      setFlyToLongitude(longitude)
      setFlyToZoomLevel(ZOOM_FLY_RADIUS)
      drawCircle(latitude, longitude)

      // Make API request for the radius filter
      let filter = `/api/v1/stations?by=radius&radius=200&longitude=${longitude}&latitude=${latitude}&`
      setTablePage(0)
      setStationLimit(1000)
      setTablePageLimit(200)
      setStationFilter(filter)
      setStationURL(`${filter}offset=0&limit=1000`)
      setShowRadiusMessage(!showRadiusMessage)
    }
  }

  const drawCircle = (latitude: number, longitude: number) => {
    if (!IsCircleAdded) {
      // Perform the action of drawing a circle on the map
      if (mapRef.current) {
        const map = mapRef.current.getMap()
        if (map) {
          const radius = CIRCLE_RADIUS
          const steps = 64 // number of sides/vertices of polygon

          const coor: number[][] = []

          for (let i = 0; i < steps; i++) {
            const angle = (Math.PI / (steps / 2)) * i
            const dx = radius * Math.cos(angle)
            const dy = radius * Math.sin(angle)
            // 111.32 is derived from distance/deg longitude change
            const newLongitude =
              longitude + dx / (111.32 * Math.cos((latitude * Math.PI) / 180))
            // 111.32 is derived from distance/deg longitude change
            const newLatitude = latitude + dy / 111.13
            const point = [newLongitude, newLatitude]
            coor.push(point)
          }
          if (coor[0] !== undefined) {
            coor.push(coor[0])
          } // Connect to first coor to close the polygon

          const circleFeature = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [coor],
            },
            properties: {},
          }

          map.addSource("circle-source", {
            type: "geojson",
            data: circleFeature,
          })

          map.addLayer({
            id: "circle-layer",
            source: "circle-source",
            type: "line",
            paint: {
              "line-color": "rgba(0, 0, 255, 0.6)",
              "line-width": 10,
              "line-dasharray": [2, 2],
            },
          })
        }
      }

      setIsCircleAdded(true)
    } else {
      // Button click handler for reverting the circle
      if (mapRef.current) {
        const map = mapRef.current.getMap()
        if (map && map.getLayer("circle-layer")) {
          map.removeLayer("circle-layer")
          map.removeSource("circle-source")
        }
      }

      setIsCircleAdded(false)
    }
  }

  const handleResetView = () => {
    if (IsCircleAdded) {
      // Remove the circle and reset the station URL
      drawCircle(null, null)
      setTablePage(0)
      setStationLimit(200)
      setTablePageLimit(40)
      setStationFilter("/api/v1/stations?")
      setStationURL("/api/v1/stations?offset=0&limit=200")
      setShowRadiusMessage(false)
    }
    setFlyToLatitude(INITIAL_LATITUDE)
    setFlyToLongitude(INITIAL_LONGITUDE)
    setFlyToZoomLevel(INITIAL_ZOOM)
  }

  const stationPins = useMemo(() => {
    if (stations && !stationsIsLoading && Array.isArray(stations)) {
      return stations.map((station, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={Number(station.longitude)}
          latitude={Number(station.latitude)}
          anchor="right"
          // Clicking the Marker will populate and open the Modal
          onClick={() => {
            setSelectedStationID(station.station_id)
            setSelectedStationCode(station.station_code)
            setSelectedTags(JSON.stringify(station.tags))
            setSelectedLatitude(Number(station.latitude))
            setSelectedLongitude(Number(station.longitude))
            setSelectedElevation(Number(station.elevation))
            setShowEditStationModal(true)
          }}
        >
          <div
            onMouseEnter={() => {
              setPopupInfo(station)
            }}
            onMouseLeave={() => {
              setPopupInfo(null)
            }}
          >
            <img src="marker.png" />
          </div>
        </Marker>
      ))
    }
    return <></>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations, stationsIsLoading])

  // ----------------------------------------------------------------------------------
  // Network related codes
  const [networkOptions, setNetworkOptions] = useState<AutocompleteOption[]>([
    { label: "", value: "" },
  ])

  useEffect(() => {
    if (networks && networks.length >= 0) {
      setNetworkOptions(
        networks.map((network) => {
          const options: AutocompleteOption = {
            label: network.data_source_id,
            value: network.data_source_id,
          }
          return options
        })
      )
    }
  }, [networks])
  // ----------------------------------------------------------------------------------

  useEffect(() => {
    if (flyToLatitude && flyToLongitude && flyToZoomLevel) {
      if (mapRef.current) {
        const map = mapRef.current as unknown as MapboxMap
        map.flyTo({
          center: [flyToLongitude, flyToLatitude],
          zoom: flyToZoomLevel,
          essential: true,
        })
      }
    }
  }, [flyToLatitude, flyToLongitude, flyToZoomLevel])

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "22px",
          left: "130px",
          zIndex: 1,
          width: "36px",
          height: "30px",
        }}
      >
        <ButtonComponent
          iconName="fa-solid fa-rotate fa-xs"
          variant="default"
          hideLabel
          onClick={handleResetView}
          tooltip
          tooltipLabel="Reset View"
        />
      </div>
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: INITIAL_LATITUDE,
          longitude: INITIAL_LONGITUDE,
          zoom: INITIAL_ZOOM,
        }}
        style={{ width: "100%", height: 600 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onDblClick={handleMapDoubleClick}
      >
        {stationPins}

        {popupInfo && (
          <Popup
            anchor="top"
            closeButton={false}
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <MarkerPopUp
              station_code={popupInfo.station_code}
              network={popupInfo.network as unknown as string[]}
              tags={popupInfo.tags}
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              archived={popupInfo.archived}
              last_observation={popupInfo.last_observation_reported}
            />
          </Popup>
        )}

        <div className="absolute top-3 p-4">
          <Autocomplete
            id="stationNetworkAutoComplete"
            options={networkOptions}
            onChange={(event: AutocompleteOption) => {
              let url = `/api/v1/stations?offset=0&limit=200&data_source=${event.value}`
              if (event.value === "") {
                url = "/api/v1/stations?offset=0&limit=200"
              }
              setStationURL(url)
            }}
          />
        </div>
        <div className="absolute" style={{ right: 50, top: 10 }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              padding: "10px",
              display: "inline-block",
            }}
          >
            {!stationsIsLoading &&
              !showRadiusMessage &&
              "Double click anywhere to see stations in a 200km radius."}
            {!stationsIsLoading &&
              showRadiusMessage &&
              `Selected ${
                stations && stations.length
              } stations within a 200km radius. Double-click again to reset the selection.`}
            {stationsIsLoading && "Performing API retrieval"}
          </div>
          <div
            className="absolute top-3 right-3"
            style={{ top: "100px", zIndex: 0 }}
          >
            <NavigationControl showCompass={true} />
          </div>
        </div>
      </Map>
    </div>
  )
}
