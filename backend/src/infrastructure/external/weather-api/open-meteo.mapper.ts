import GeocodeValueObject from "src/domain/location/geocode.value-object";
import WeatherDayValueObject from "src/domain/activity/value-objects/weather-day.value-object";
import WeatherValueObject from "src/domain/activity/value-objects/weather.value-object";
import { OpenMeteoForecastResponse, OpenMeteoGeocodingResponse } from "./open-meteo.types";

export default class OpenMeteoMapper {
    static toGeocode(data: OpenMeteoGeocodingResponse): GeocodeValueObject {
        return new GeocodeValueObject(
            data.name,
            data.country,
            data.latitude,
            data.longitude
        );
    }

    static toWeather(data: OpenMeteoForecastResponse): WeatherValueObject {
        const daily = data.daily;
        const days: WeatherDayValueObject[] = daily.time.map((date, index) =>
            new WeatherDayValueObject(
                date,
                daily.temperature_2m_min[index] ?? 0,
                daily.temperature_2m_max[index] ?? 0,
                daily.rain_sum[index] ?? 0,
                daily.snowfall_sum[index] ?? 0,
                daily.wind_speed_10m_max[index] ?? 0,
                daily.wind_gusts_10m_max[index] ?? 0,
            )
        );

        return new WeatherValueObject(data.latitude, data.longitude, days);
    }
}