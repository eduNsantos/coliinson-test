import axios from "axios";
import type ForecastContract from "src/domain/activity/contracts/activity.contract";
import type LocationRepository from "src/domain/location/location.repository";
import { OpenMeteoForecastResponse, OpenMeteoGeocodingSearchResponse } from "./open-meteo.types";
import OpenMeteoMapper from "./open-meteo.mapper";
import WeatherValueObject from "src/domain/activity/value-objects/weather.value-object";
import GeocodeValueObject from "src/domain/location/geocode.value-object";

export default class OpenMeteoRepository implements LocationRepository, ForecastContract {
  async findLocationByName(name: string): Promise<GeocodeValueObject[]> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=pt&format=json`;
    const response = await axios.get<OpenMeteoGeocodingSearchResponse>(url);

    if (!response.data?.results || response.data.results.length === 0) {
      throw new Error(`No results found for location: ${name}`);
    }

    return response.data.results.map(OpenMeteoMapper.toGeocode);
  }

  async getForecastByCoordinates(latitude: number, longitude: number): Promise<WeatherValueObject> {
    const response = await axios.get<OpenMeteoForecastResponse>(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min,temperature_2m_max,snowfall_sum,rain_sum,wind_speed_10m_max,wind_gusts_10m_max`
    );

    const { data } = response;
    if (!data.daily || data.daily.time.length === 0) {
      throw new Error(`No forecast data available for coordinates: ${latitude}, ${longitude}`);
    }

    return OpenMeteoMapper.toWeather(data);
  }
}
