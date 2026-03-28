import axios from "axios";
import ActivityContract from "src/domain/activity/contracts/activity.contract";
import { OpenMeteoForecastResponse, OpenMeteoGeocodingSearchResponse } from "./open-meteo.types";
import GeocodeValueObject from "src/domain/activity/value-objects/geocode.value-object";
import OpenMeteoMapper from "src/infrastructure/external/weather-api/open-meteo.mapper";
import WeatherValueObject from "src/domain/activity/value-objects/weather.value-object";

export default class OpenMeteoRepository implements ActivityContract {
    async getLocationCoordinates(city: string): Promise<GeocodeValueObject> {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;

        const response = await axios.get<OpenMeteoGeocodingSearchResponse>(
            url
        );

        if (!response.data?.results || response.data.results.length === 0) {
            throw new Error(`No results found for city: ${city}`);
        }

        const result = response.data.results[0];

        const coordinates = OpenMeteoMapper.toGeocode(result);

        return coordinates;
    }

    async getForecastByCoordinates(latitude: number, longitude: number): Promise<WeatherValueObject> {

        const response = await axios.get<OpenMeteoForecastResponse>(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=temperature_2m_min,temperature_2m_max,snowfall_sum,rain_sum,wind_speed_10m_max,wind_gusts_10m_max`
        )

        const data = response.data;

        if ((!data.hourly || data.hourly.temperature_2m.length === 0) && (!data.daily || data.daily.time.length === 0)) {
            throw new Error(`No forecast data available for coordinates: ${latitude}, ${longitude}`);
        }

        return OpenMeteoMapper.toWeather(data);
    }
}
