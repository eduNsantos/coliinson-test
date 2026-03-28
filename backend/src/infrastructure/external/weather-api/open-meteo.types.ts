
export type OpenMeteoHourlyUnits = {
  time: string;
  temperature_2m: string;
};

export type OpenMeteoHourlyData = {
  time: string[];
  temperature_2m: number[];
};

export type OpenMeteoDailyUnits = {
  time: string;
  temperature_2m_min: string;
  temperature_2m_max: string;
  snowfall_sum: string;
  rain_sum: string;
  wind_speed_10m_max: string;
  wind_gusts_10m_max: string;
};

export type OpenMeteoDailyData = {
  time: string[];
  temperature_2m_min: number[];
  temperature_2m_max: number[];
  snowfall_sum: number[];
  rain_sum: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
};

export type OpenMeteoForecastResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  hourly_units: OpenMeteoHourlyUnits;
  hourly: OpenMeteoHourlyData;
  daily_units: OpenMeteoDailyUnits;
  daily: OpenMeteoDailyData;
};

export type OpenMeteoGeocodingResponse = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
  admin2: string;
};

export type OpenMeteoGeocodingSearchResponse = {
  results: OpenMeteoGeocodingResponse[];
}