import React, { useContext, useEffect, useState } from 'react'
import { Button, useWizard, Heading, Input, Autocomplete, Tooltip as TooltipComponent, Icon } from "@eco/stratos-components"
import { MissingDeviceContext } from 'components/context/MissingDeviceContext';

export default function Step2GeolocationDetailsForm() {
    const missingDeviceContext = useContext(MissingDeviceContext)

    const [{ currentStep }, { incrementCurrentStep, markCompleted, decrementCurrentStep }] = useWizard()
    const [disableNextStep, setDisableNextStep ] = useState<boolean>(true)
    const [networkOptions, setNetworkOptions ] = useState<NetworkTypes[]>([])

    type NetworkTypes = {
        label: string;
        value: string;
    }

    useEffect(() => {
        const options: NetworkTypes[] = missingDeviceContext?.networks.map(element => {
            return { label: element.data_source_id, value: element.data_source_id}
        }) as NetworkTypes[];

        setNetworkOptions(options)
    }, [missingDeviceContext?.networks])

    useEffect(() => {

        if (
            missingDeviceContext?.dataSourceId !== "" &&
            missingDeviceContext?.sourceDeviceId !== "" &&
            missingDeviceContext?.sourceStationId !== "" &&
            missingDeviceContext?.latitude !== "" &&
            missingDeviceContext?.longitude !== ""
        ) {
            setDisableNextStep(false)
        } else {
            setDisableNextStep(true)
        }

    }, [
        missingDeviceContext?.dataSourceId,
        missingDeviceContext?.sourceDeviceId,
        missingDeviceContext?.sourceStationId,
        missingDeviceContext?.latitude,
        missingDeviceContext?.longitude
    ])

    return (
        <div>
            <div className='flex justify-between'>
                <Heading as="h3" size="md">
                    Geolocation Details
                </Heading>
                <div className='space-x-3.5'>
                    <Button
                            id="btn-basic-default"
                            variant="default"
                            onClick={() => decrementCurrentStep()}
                        >
                        Prev Step
                    </Button>
                    <Button
                            id="btn-basic-primary"
                            variant="primary"
                            onClick={() => {
                                incrementCurrentStep()
                                markCompleted(currentStep)
                            }}
                            disabled={disableNextStep}
                        >
                        Next Step
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 ">
                <div>
                    <span className='pr-4'>Device ID</span>
                    <TooltipComponent id="ecoIconTooltipTop" placement="right" label="If value is unknown, default is 1">
                        <Icon id="basic-icon-xl" icon="fa-sharp fa-regular fa-circle-info" size="sm" color="slate" />
                    </TooltipComponent>
                    <Input
                        name="deviceID"
                        label=''
                        hideLabel={true}
                        placeholder="Device ID"
                        value={missingDeviceContext?.sourceDeviceId}
                        onChange={(event) => {missingDeviceContext?.setSourceDeviceId((event.target as HTMLInputElement).value)}}
                    />
                </div>
                <div>
                    <Input
                        label="Latitude *"
                        name="latitude"
                        placeholder="Latitude"
                        value={missingDeviceContext?.latitude}
                        onChange={(event) => {missingDeviceContext?.setLatitude((event.target as HTMLInputElement).value)}}
                    />
                </div>
                <div>
                    <Input
                        label="Station ID"
                        name="stationID"
                        placeholder="Station ID"
                        value={missingDeviceContext?.sourceStationId}
                        onChange={(event) => {missingDeviceContext?.setSourceStationId((event.target as HTMLInputElement).value)}}
                    />
                </div>
                <div>
                    <Input
                        label="Longitude *"
                        name="longitude"
                        placeholder="Longitude"
                        value={missingDeviceContext?.longitude}
                        onChange={(event) => {missingDeviceContext?.setLongitude((event.target as HTMLInputElement).value)}}
                    />
                </div>
                <div>
                <Autocomplete
                    id="networkAutocompleteId"
                    labelFor="Network"
                    placeholderText="Network"
                    options={networkOptions}
                    onChange={(event) => {missingDeviceContext?.setDataSourceId((event as NetworkTypes).value)}}
                    value={{label: missingDeviceContext?.dataSourceId, value: missingDeviceContext?.dataSourceId} as NetworkTypes}
                    />
                </div>
                <div>
                    <Input
                        label="Elevation"
                        name="elevation"
                        placeholder="Elevation"
                        value={missingDeviceContext?.elevation}
                        onChange={(event) => {missingDeviceContext?.setElevation((event.target as HTMLInputElement).value)}}
                    />
                </div>

        </div>
        </div>
    )
}
