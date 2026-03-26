import axios from "axios";
import ActivityContract from "src/domain/activity/contracts/activity.contract";
import { OpenMeteoForecastResponse, OpenMeteoGeocodingSearchResponse } from "./open-meteo.types";
import { Location } from "src/domain/activity/entities/location.entity";
import { Geocode } from "src/domain/activity/entities/geocode.entity";

export default class OpenMeteoRepository implements ActivityContract {
    async getLocationByCityOrTown(city: string): Promise<Geocode> {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;

        const response = await axios.get<OpenMeteoGeocodingSearchResponse>(
            url
        );

        return response.data.results[0];
    }

    async findRankingByCityOrTown(search: string): Promise<OpenMeteoForecastResponse> {

        const info = await this.getLocationByCityOrTown(search);

        const response = await axios.get<OpenMeteoForecastResponse>(
            `https://api.open-meteo.com/v1/forecast?latitude=${info.latitude}&longitude=${info.longitude}&hourly=temperature_2m`
        );


        const location = response.data;

        return location[0];

        // return {
        //     name: info.name,
        //     country: info.country,
        //     latitude: location.latitude,
        //     longitude: location.longitude
        // };
    }
}
