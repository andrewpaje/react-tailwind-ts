export interface StationData {
    station_id: string;
    station_code: string;
    network: string;
    tags: Tags;
    latitude: string;
    longitude: string;
    elevation: string;
    archived: boolean;
    last_observation_reported: string | null;
}

export interface Tags {
    name?: string;
    wmo?: string;
    ghcndId?: string;
    mgID?: string;
    icao?: string;
}