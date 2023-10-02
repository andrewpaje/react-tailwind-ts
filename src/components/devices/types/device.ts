export interface DeviceData {
    record_id: string;
    source_station_id: string;
    source_device_id: string;
    active: boolean | null;
    update_datetime: string;
    geolocation_id: string;
    dtn_station_id_v2: string;
    last_updated_by: string;
    station_code: string;
    latitude: string;
    longitude: string;
    network: string;
    username: string;
}

export interface MissingDevice {
    network: string;
    sourceDeviceID: string;
    sourceStationID: string;
}