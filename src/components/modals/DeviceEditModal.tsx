import React, { useState, useContext, useEffect } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Toggle,
} from "@eco/stratos-components"
import { DeviceData } from "components/devices/types"
import { MainContext } from "components/context/MainContext"

interface Props {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  toEditDevice: DeviceData;
  selectedStationCode: string;
  setSelectedStationCode: React.Dispatch<React.SetStateAction<string>>;
  selectedStatus: boolean;
  setSelectedStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setDeviceUpdateURL: React.Dispatch<React.SetStateAction<string>>;
  updateDeviceInfo: () => Promise<void>;
}

export const DeviceEditModal = ({
  showEditModal,
  setShowEditModal,
  toEditDevice,
  selectedStationCode,
  setSelectedStationCode,
  selectedStatus,
  setSelectedStatus,
  setDeviceUpdateURL,
  updateDeviceInfo,
}: Props) => {
  const [disableSave, setDisableSave] = useState(true)
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (selectedStationCode !== toEditDevice.station_code) {
      setDisableSave(false)
    } else if (selectedStatus !== toEditDevice.active) {
      setDisableSave(false)
    } else {
      setDisableSave(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStationCode, selectedStatus])

  const onUpdate = () => {
    let deviceStatus = "True"
    if (!selectedStatus) {
      deviceStatus = "False"
    }
    setShowEditModal(false)
    mainContext?.setBannerVariant("success")
    mainContext?.setBannerMessage(
      `${selectedStationCode} information updated successfully.`
    )
    void updateDeviceInfo()
  }

  useEffect(() => {
    let url = `/api/v1/devices/${toEditDevice.record_id}?`
    if (selectedStationCode !== "") {
      url = url + `station_code=${String(selectedStationCode)}`
    }

    let deviceStatus = "True"
    if (!selectedStatus) {
      deviceStatus = "False"
    }

    url = url + `&active=${deviceStatus}`

    setDeviceUpdateURL(url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, selectedStationCode])

  return (
    <Modal
      id="test-advanced-modal"
      open={showEditModal}
      onCancel={() => setShowEditModal(false)}
      showIcon={false}
      showCloseMarker={true}
    >
      <ModalHeader>UPDATE DEVICE INFORMATION</ModalHeader>
      <ModalBody>
        <div className="my-4 w-full">
          <Input
            label="Network"
            name="network"
            placeholder="Network"
            onChange={(e) => {}}
            disabled={true}
            value={toEditDevice.network}
          />
        </div>
        <div className="flex">
          <div className="w-1/2 pr-1">
            <Input
              label="Source Device ID"
              name="SourceDeviceID"
              placeholder="Source Device ID"
              onChange={(e) => {}}
              disabled={true}
              value={toEditDevice.source_device_id}
            />
          </div>
          <div className="w-1/2 pl-1">
            <Input
              label="Source Station ID"
              name="Source Station ID"
              placeholder="Source Station ID"
              onChange={(e) => {}}
              disabled={true}
              value={toEditDevice.source_station_id}
            />
          </div>
        </div>

        <div className="flex py-4">
          <div className="w-1/2 pr-1">
            <Input
              label="Station Code"
              name="station_code"
              placeholder="Station Code"
              onChange={(e) =>
                setSelectedStationCode((e.target as HTMLInputElement).value)
              }
              value={selectedStationCode}
            />
          </div>
          <div className="w-1/2 pl-14 pt-8 pb-0">
            <Toggle
              id="offDefault"
              name="offDefault"
              label="Status"
              checked={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="mr-2">
          <Button variant="default" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </div>
        <div className="mr-2">
          <Button
            variant="primary"
            onClick={() => onUpdate()}
            disabled={disableSave}
          >
            Save
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
