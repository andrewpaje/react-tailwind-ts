/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, ChangeEvent, useEffect, useContext } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as ButtonComponent,
  Input,
} from "@eco/stratos-components"
import { TagElement } from "./TagElement"
import { Tag } from "components/station/tag.type"
import { v4 as uuidv4 } from "uuid"
import { MainContext } from "components/context/MainContext"

interface Props {
  latitude: number | string;
  setLatitude: React.Dispatch<React.SetStateAction<number | string>>;
  longitude: number | string;
  setLongitude: React.Dispatch<React.SetStateAction<number | string>>;
  elevation: number | string;
  setElevation: React.Dispatch<React.SetStateAction<number | string>>;
  showEditStationModal: boolean;
  setShowEditStationModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStationCode: string;
  selectedTags: string;
  setSelectedTags: React.Dispatch<React.SetStateAction<number | string>>;
  selectedStationID: string;
  setStationUpdateURL: React.Dispatch<React.SetStateAction<string>>;
  updateStationInfo: () => Promise<void>;
}

export const StationEditModal = ({
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  elevation,
  setElevation,
  showEditStationModal,
  setShowEditStationModal,
  selectedStationCode,
  selectedTags,
  setSelectedTags,
  selectedStationID,
  setStationUpdateURL,
  updateStationInfo,
}: Props) => {
  const mainContext = useContext(MainContext)

  const [tags, setTags] = useState<Tag[] | null>(null)
  useEffect(() => {
    if (selectedTags !== "") {
      setTags(
        Object.entries(JSON.parse(selectedTags)).map(([field, value]): Tag => {
          return { id: uuidv4() as string, field, value }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags])

  const cancel = (): void => {
    setShowEditStationModal(false)
  }

  useEffect(() => {
    let url = `/api/v1/stations/${selectedStationID}?`
    if (latitude !== "") {
      url = url + `latitude=${String(latitude)}`
    }
    if (longitude !== "") {
      url = url + `&longitude=${String(longitude)}`
    }
    if (elevation !== "") {
      url = url + `&elevation=${String(elevation)}`
    }
    if (selectedTags !== "") {
      url = url + `&tags=${encodeURIComponent(selectedTags)}`
    }
    setStationUpdateURL(url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, elevation, selectedTags])

  return (
    <Modal
      id="station-edit-form-modal"
      open={showEditStationModal}
      onCancel={() => cancel()}
      showIcon={false}
      showCloseMarker={true}
      variant="info"
    >
      <ModalHeader>
        <p className="text-center text-green-600">{selectedStationCode}</p>
      </ModalHeader>

      <ModalBody>
        <div className="grid grid-cols-3">
          <div>
            <Input
              type="number"
              label="Latitude"
              name="StationLatitude"
              size="lg"
              placeholder="Latitude"
              onChange={(e: ChangeEvent) => {
                setLatitude((e.target as HTMLInputElement).value)
              }}
              disabled={false}
              value={latitude}
            />
          </div>
          <div>
            <Input
              type="number"
              label="Longitude"
              name="StationLongitude"
              size="lg"
              placeholder="longitude"
              onChange={(e: ChangeEvent) => {
                setLongitude((e.target as HTMLInputElement).value)
              }}
              disabled={false}
              value={longitude}
            />
          </div>
          <div>
            <Input
              type="number"
              label="Elevation"
              name="StationElevation"
              size="lg"
              placeholder="Elevation"
              onChange={(e: ChangeEvent) => {
                setElevation((e.target as HTMLInputElement).value)
              }}
              disabled={false}
              value={elevation}
            />
          </div>
        </div>

        <br />
        <h3>Tags</h3>

        {selectedTags !== "" && tags !== null ? (
          <TagElement
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        ) : (
          <></>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="mr-2">
          <ButtonComponent variant="default" onClick={() => cancel()}>
            Cancel
          </ButtonComponent>
        </div>
        <div className="mr-2">
          <ButtonComponent
            variant="primary"
            onClick={() => {
              mainContext?.setBannerVariant("success")
              mainContext?.setBannerMessage(
                `${selectedStationCode} information updated successfully.`
              )
              setShowEditStationModal(false)
              void updateStationInfo()
            }}
          >
            Save
          </ButtonComponent>
        </div>
      </ModalFooter>
    </Modal>
  )
}
