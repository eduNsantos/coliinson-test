
export type OpenMeteoHourlyUnits = {
  time: string; // "iso8601"
  temperature_2m: string; // "°C"
};

export type OpenMeteoHourlyData = {
  time: string[]; // datas/hora
  temperature_2m: number[]; // temperaturas correspondentes
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
};

export type OpenMeteoGeocodingResponse = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export type OpenMeteoGeocodingSearchResponse = {
  results: OpenMeteoGeocodingResponse[];
}