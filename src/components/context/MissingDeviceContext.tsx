import React from "react"
import { createContext, useState, useEffect } from "react";
import { MissingDeviceRow, NetworkRow } from "pages/devices/add";

type MissingDeviceContextProviderProps = {
    children: React.ReactNode
}

export type MissingDeviceContextType = {
    missingDeviceRecordId: string;
    setMissingDeviceRecordId: React.Dispatch<React.SetStateAction<string | null>>;
    missingDeviceId: number;
    setMissingDeviceId: React.Dispatch<React.SetStateAction<number | null>>;
    dataSourceId: string;
    setDataSourceId: React.Dispatch<React.SetStateAction<string | null>>;
    sourceDeviceId: string;
    setSourceDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
    sourceStationId: string;
    setSourceStationId: React.Dispatch<React.SetStateAction<string | null>>;
    latitude: string;
    setLatitude: React.Dispatch<React.SetStateAction<string | null>>;
    longitude: string;
    setLongitude: React.Dispatch<React.SetStateAction<string | null>>;
    elevation: string;
    setElevation: React.Dispatch<React.SetStateAction<string | null>>;
    missingDeviceRecords: MissingDeviceRow[];
    setMissingDeviceRecords: React.Dispatch<React.SetStateAction<MissingDeviceRow[] | null>>;
    missingDeviceFetchOngoing: boolean;
    setMissingDeviceFetchOngoing: React.Dispatch<React.SetStateAction<boolean>>;
    networks: NetworkRow[];
    setNetworks: React.Dispatch<React.SetStateAction<NetworkRow[] | null>>;

}

export const MissingDeviceContext = createContext<MissingDeviceContextType | null>(null)

export const MissingDeviceContextProvider = ({
    children,
}: MissingDeviceContextProviderProps) => {
    const [ missingDeviceRecordId, setMissingDeviceRecordId ] = useState<string>("")
    const [ missingDeviceId, setMissingDeviceId ] = useState<number>(0)
    const [ dataSourceId, setDataSourceId ] = useState<string>("")
    const [ sourceDeviceId, setSourceDeviceId ] = useState<string>("")
    const [ sourceStationId, setSourceStationId ] = useState<string>("")
    const [ latitude, setLatitude ] = useState<string>("")
    const [ longitude, setLongitude ] = useState<string>("")
    const [ elevation, setElevation ] = useState<string>("")
    const [ missingDeviceRecords, setMissingDeviceRecords ] = useState<MissingDeviceRow[]>([])
    const [ missingDeviceFetchOngoing, setMissingDeviceFetchOngoing ] = useState<boolean>(false)
    const [ networks, setNetworks ] = useState<NetworkRow[]>([])

    return <MissingDeviceContext.Provider
            value={{
                missingDeviceRecordId, setMissingDeviceRecordId,
                missingDeviceId, setMissingDeviceId,
                dataSourceId, setDataSourceId,
                sourceDeviceId, setSourceDeviceId,
                sourceStationId, setSourceStationId,
                latitude, setLatitude,
                longitude, setLongitude,
                elevation, setElevation,
                missingDeviceRecords, setMissingDeviceRecords,
                missingDeviceFetchOngoing, setMissingDeviceFetchOngoing,
                networks, setNetworks
            }}>
                {children}
            </MissingDeviceContext.Provider>
}
