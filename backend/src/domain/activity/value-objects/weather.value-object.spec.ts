import WeatherDayValueObject from './weather-day.value-object';
import WeatherValueObject from './weather.value-object';

const makeWeatherDay = (
  date: string,
  overrides: Partial<{
    minTemp: number;
    maxTemp: number;
    rain: number;
    snow: number;
    windSpeed: number;
    windGust: number;
  }> = {}
) =>
  new WeatherDayValueObject(
    date,
    overrides.minTemp ?? 15,
    overrides.maxTemp ?? 24,
    overrides.rain ?? 0,
    overrides.snow ?? 0,
    overrides.windSpeed ?? 22,
    overrides.windGust ?? 0,
  );

describe('WeatherValueObject', () => {
  describe('getBestDays*', () => {
    it('returns only days good for surf', () => {
      const goodDay = makeWeatherDay('2024-01-01', { windSpeed: 22, windGust: 0, rain: 0 });
      const badDay = makeWeatherDay('2024-01-02', { windSpeed: 0, windGust: 60, rain: 10 });
      const weather = new WeatherValueObject(0, 0, [goodDay, badDay]);

      const result = weather.getBestDaysForSurf();
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2024-01-01');
    });

    it('returns only days good for outdoor', () => {
      const goodDay = makeWeatherDay('2024-01-01', { maxTemp: 24, rain: 0 });
      const badDay = makeWeatherDay('2024-01-02', { maxTemp: 24, rain: 15 });
      const weather = new WeatherValueObject(0, 0, [goodDay, badDay]);

      const result = weather.getBestDaysForOutdoor();
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2024-01-01');
    });

    it('returns only days good for ski', () => {
      const goodDay = makeWeatherDay('2024-01-01', { snow: 4, maxTemp: -5, rain: 0 });
      const badDay = makeWeatherDay('2024-01-02', { snow: 0, maxTemp: 20, rain: 0 });
      const weather = new WeatherValueObject(0, 0, [goodDay, badDay]);

      const result = weather.getBestDaysForSki();
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2024-01-01');
    });

    it('returns only days good for indoor', () => {
      const goodDay = makeWeatherDay('2024-01-01', { rain: 10 });
      const badDay = makeWeatherDay('2024-01-02', { rain: 0, maxTemp: 20, snow: 0 });
      const weather = new WeatherValueObject(0, 0, [goodDay, badDay]);

      const result = weather.getBestDaysForIndoor();
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2024-01-01');
    });

    it('returns empty array when no day is good', () => {
      const badDay = makeWeatherDay('2024-01-01', { snow: 0, maxTemp: 25, rain: 0 });
      const weather = new WeatherValueObject(0, 0, [badDay]);

      expect(weather.getBestDaysForSki()).toHaveLength(0);
    });
  });

  describe('average scores', () => {
    it('getSurfScore returns average of all days surf scores', () => {
      const day1 = makeWeatherDay('2024-01-01', { windSpeed: 22, windGust: 0, rain: 0 }); // 100
      const day2 = makeWeatherDay('2024-01-02', { windSpeed: 10, windGust: 0, rain: 0 }); // 52
      const weather = new WeatherValueObject(0, 0, [day1, day2]);

      expect(weather.getSurfScore()).toBe(Math.round((100 + 52) / 2));
    });

    it('getOutdoorScore returns average of all days outdoor scores', () => {
      const day1 = makeWeatherDay('2024-01-01', { maxTemp: 24, rain: 0 }); // 100
      const day2 = makeWeatherDay('2024-01-02', { maxTemp: 30, rain: 0 }); // 82
      const weather = new WeatherValueObject(0, 0, [day1, day2]);

      expect(weather.getOutdoorScore()).toBe(Math.round((100 + 82) / 2));
    });

    it('getSkiScore returns average of all days ski scores', () => {
      const day1 = makeWeatherDay('2024-01-01', { snow: 0, maxTemp: 4, rain: 0 }); // 32
      const day2 = makeWeatherDay('2024-01-02', { snow: 0, maxTemp: 20, rain: 0 }); // 0
      const weather = new WeatherValueObject(0, 0, [day1, day2]);

      expect(weather.getSkiScore()).toBe(Math.round((32 + 0) / 2));
    });

    it('getIndoorScore returns average of all days indoor scores', () => {
      const day1 = makeWeatherDay('2024-01-01', { rain: 5, maxTemp: 20, snow: 0 }); // 55
      const day2 = makeWeatherDay('2024-01-02', { rain: 0, maxTemp: 20, snow: 0 }); // 20
      const weather = new WeatherValueObject(0, 0, [day1, day2]);

      expect(weather.getIndoorScore()).toBe(Math.round((55 + 20) / 2));
    });

    it('returns 0 for average score when days list is empty', () => {
      const weather = new WeatherValueObject(0, 0, []);
      expect(weather.getSurfScore()).toBe(0);
      expect(weather.getOutdoorScore()).toBe(0);
      expect(weather.getSkiScore()).toBe(0);
      expect(weather.getIndoorScore()).toBe(0);
    });
  });

  describe('getAverageMaxTemp', () => {
    it('returns average max temperature across all days', () => {
      const day1 = makeWeatherDay('2024-01-01', { maxTemp: 20 });
      const day2 = makeWeatherDay('2024-01-02', { maxTemp: 30 });
      const weather = new WeatherValueObject(0, 0, [day1, day2]);

      expect(weather.getAverageMaxTemp()).toBe(25);
    });
  });
});
