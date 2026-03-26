
export type OpenMeteoLocationResponse = {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

export type OpenMeteoSearchResponse = {
    results: OpenMeteoLocationResponse[];
}