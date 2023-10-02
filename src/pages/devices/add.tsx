import React, { createContext, useState, useMemo, useContext, useEffect } from 'react'
import PageTemplate from 'components/layout/PageTemplate'
import { MissingDeviceContextProvider } from 'components/context/MissingDeviceContext'
import AddDeviceWizard from 'components/devices/Wizard/AddDeviceWizard'
import { useFetchMissingDeviceData } from 'hooks/useFetchMissingDeviceData'
import { useFetchBackendToken } from 'hooks/useFetchBackendToken'
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export interface MissingDevices {
    id: string;
    data_source_id: string;
    station_id: string;
    device_id: string;
  }

export interface MissingDeviceRow {
    id: string;
    data_source_id: string;
    station_id: string;
    device_id: string;
    latitude?: number;
    longitude?: number;
    elevation?: number;
    is_resolved?: boolean;
}

export interface NetworkRow {
    data_source_id: string;
}

export default withPageAuthRequired(function DevicePage() {

    const token = useFetchBackendToken([])
    let [data, loading] = useFetchMissingDeviceData<MissingDeviceRow[]>(`${process.env.BACKEND_API_END_POINT as string}/api/v1/missing/devices`, [], token)
    const [ missing_devices, setMissingDevices ] = useState<MissingDeviceRow[]>([])

    useEffect(() => {
        if (data.length > 1) {
            data = data.map(({id, data_source_id, station_id, device_id, latitude, longitude, elevation, is_resolved}) => ({
                id, data_source_id, device_id, station_id
            }))
            setMissingDevices(data)
        }
    }, [data])

    const [networksData, networkDataLoading ] = useFetchMissingDeviceData<NetworkRow[]>(`${process.env.BACKEND_API_END_POINT as string}/api/v1/datasources`, [], token)
    const [ networks, setNetworks ] = useState<NetworkRow[]>([])

    useEffect(() => {
        if (networksData.length > 1) {
            setNetworks(networksData)
        }
    }, [networksData])



    return (
    <PageTemplate title='New Device'>
        <MissingDeviceContextProvider>
            <AddDeviceWizard
                missing_devices={missing_devices}
                missing_devices_loading={loading}
                networks={networks}
            />
        </MissingDeviceContextProvider>
    </PageTemplate>
    )
})