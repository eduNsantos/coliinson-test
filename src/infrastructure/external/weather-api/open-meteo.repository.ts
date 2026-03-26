import axios from "axios";
import ActivityContract from "src/domain/activity/contracts/activity.contract";
import { OpenMeteoSearchResponse } from "./open-meteo.types";
import { Location } from "src/domain/activity/entities/location.entity";

export default class OpenMeteoRepository implements ActivityContract {
    private readonly apiUrl: string = "https://api.open-meteo.com/v1";

    async findRankingByCityOrTown(search: string): Promise<Location> {
        const response = await axios.get<OpenMeteoSearchResponse>(
            `${this.apiUrl}/search?name=${search}`
        );

        const location = response.data.results[0];

        return {
            name: location.name,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude
        };
    }
}
