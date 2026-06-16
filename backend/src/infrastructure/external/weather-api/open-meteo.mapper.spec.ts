import OpenMeteoMapper from './open-meteo.mapper';
import { OpenMeteoForecastResponse, OpenMeteoGeocodingResponse } from './open-meteo.types';

const makeGeocodingResponse = (overrides: Partial<OpenMeteoGeocodingResponse> = {}): OpenMeteoGeocodingResponse => ({
  id: 1,
  name: 'São Paulo',
  latitude: -23.5505,
  longitude: -46.6333,
  elevation: 760,
  feature_code: 'PPLA',
  country_code: 'BR',
  admin1_id: 1,
  admin2_id: 2,
  timezone: 'America/Sao_Paulo',
  population: 12300000,
  country_id: 31,
  country: 'Brazil',
  admin1: 'São Paulo',
  admin2: 'São Paulo',
  ...overrides,
});

const makeForecastResponse = (overrides: Partial<OpenMeteoForecastResponse> = {}): OpenMeteoForecastResponse => ({
  latitude: -23.5505,
  longitude: -46.6333,
  generationtime_ms: 1.5,
  utc_offset_seconds: -10800,
  timezone: 'America/Sao_Paulo',
  timezone_abbreviation: 'BRT',
  elevation: 760,
  hourly_units: { time: 'iso8601', temperature_2m: '°C' },
  hourly: { time: [], temperature_2m: [] },
  daily_units: {
    time: 'iso8601',
    temperature_2m_min: '°C',
    temperature_2m_max: '°C',
    snowfall_sum: 'cm',
    rain_sum: 'mm',
    wind_speed_10m_max: 'km/h',
    wind_gusts_10m_max: 'km/h',
  },
  daily: {
    time: ['2024-01-01', '2024-01-02'],
    temperature_2m_min: [18, 16],
    temperature_2m_max: [28, 25],
    snowfall_sum: [0, 0],
    rain_sum: [2, 0],
    wind_speed_10m_max: [20, 15],
    wind_gusts_10m_max: [30, 25],
  },
  ...overrides,
});

describe('OpenMeteoMapper', () => {
  describe('toGeocode', () => {
    it('maps geocoding response to GeocodeValueObject', () => {
      const data = makeGeocodingResponse();
      const result = OpenMeteoMapper.toGeocode(data);

      expect(result.city).toBe('São Paulo');
      expect(result.country).toBe('Brazil');
      expect(result.latitude).toBe(-23.5505);
      expect(result.longitude).toBe(-46.6333);
    });
  });

  describe('toWeather', () => {
    it('maps forecast response to WeatherValueObject with correct coordinates', () => {
      const data = makeForecastResponse();
      const result = OpenMeteoMapper.toWeather(data);

      expect(result.latitude).toBe(-23.5505);
      expect(result.longitude).toBe(-46.6333);
    });

    it('maps all daily entries to WeatherDayValueObjects', () => {
      const data = makeForecastResponse();
      const result = OpenMeteoMapper.toWeather(data);

      expect(result.days).toHaveLength(2);
    });

    it('maps day fields correctly', () => {
      const data = makeForecastResponse();
      const result = OpenMeteoMapper.toWeather(data);
      const firstDay = result.days[0];

      expect(firstDay.date).toBe('2024-01-01');
      expect(firstDay.minTemperature).toBe(18);
      expect(firstDay.maxTemperature).toBe(28);
      expect(firstDay.rain).toBe(2);
      expect(firstDay.snow).toBe(0);
      expect(firstDay.windSpeed).toBe(20);
      expect(firstDay.windGust).toBe(30);
    });

    it('falls back to 0 for null/undefined daily values', () => {
      const data = makeForecastResponse({
        daily: {
          time: ['2024-01-01'],
          temperature_2m_min: [null as any],
          temperature_2m_max: [null as any],
          snowfall_sum: [null as any],
          rain_sum: [null as any],
          wind_speed_10m_max: [null as any],
          wind_gusts_10m_max: [null as any],
        },
      });

      const result = OpenMeteoMapper.toWeather(data);
      const day = result.days[0];

      expect(day.minTemperature).toBe(0);
      expect(day.maxTemperature).toBe(0);
      expect(day.rain).toBe(0);
      expect(day.snow).toBe(0);
      expect(day.windSpeed).toBe(0);
      expect(day.windGust).toBe(0);
    });
  });
});
