import React, { useState, useEffect, useContext} from 'react'
import { Wizard, Heading, WizardSteps, WizardStep, WizardPanels, WizardPanel, useWizard, WizardProvider, Button as ButtonComponent } from "@eco/stratos-components";
import Step1Form from './Step1MissingDeviceForm';
import Step2GeolocationDetailsForm from './Step2GeolocationDetailsForm'
import Step3ReviewForm from './Step3ReviewForm';
import { useFetchBackendToken } from 'hooks/useFetchBackendToken'
import { useFetchMissingDeviceData } from 'hooks/useFetchMissingDeviceData';
import { MissingDevices, NetworkRow } from 'pages/devices/add';
import { MissingDeviceContext } from 'components/context/MissingDeviceContext';

export interface MissingDevicesProps {
  id: number;
  data_source_id: string;
  station_id: string;
  device_id: string;
}

const AddDeviceWizard = ({missing_devices, missing_devices_loading, networks}: {missing_devices: MissingDevices[]; missing_devices_loading: boolean; networks: NetworkRow[]}) => {

  const missingDeviceContext = useContext(MissingDeviceContext)

  useEffect(() => {
    missingDeviceContext?.setMissingDeviceRecords(missing_devices)

  }, [missing_devices_loading, missing_devices, missingDeviceContext])

  useEffect(() => {
    missingDeviceContext?.setNetworks(networks)
  }, [networks, missingDeviceContext])

  return (
    <Wizard>
      <WizardProvider startingIndex={0}>
        <WizardSteps>
            <WizardStep>Missing Devices</WizardStep>
            <WizardStep>Geolocation Details</WizardStep>
            <WizardStep>Review</WizardStep>
        </WizardSteps>
        <WizardPanels>
          <WizardPanel>
            <div>
              <Step1Form />
            </div>
          </WizardPanel>
          <WizardPanel>
            <div>
              <Step2GeolocationDetailsForm />
            </div>
          </WizardPanel>
          <WizardPanel>
            <div>
              <Step3ReviewForm />
            </div>
          </WizardPanel>
        </WizardPanels>
        </WizardProvider>
        </Wizard>
  )
}

export default AddDeviceWizard