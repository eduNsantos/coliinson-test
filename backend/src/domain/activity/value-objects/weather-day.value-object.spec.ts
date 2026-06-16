import WeatherDayValueObject from './weather-day.value-object';

const makeDay = (overrides: Partial<{
  date: string;
  minTemperature: number;
  maxTemperature: number;
  rain: number;
  snow: number;
  windSpeed: number;
  windGust: number;
}> = {}) =>
  new WeatherDayValueObject(
    overrides.date ?? '2024-01-01',
    overrides.minTemperature ?? 15,
    overrides.maxTemperature ?? 24,
    overrides.rain ?? 0,
    overrides.snow ?? 0,
    overrides.windSpeed ?? 22,
    overrides.windGust ?? 30,
  );

describe('WeatherDayValueObject', () => {
  describe('getOutdoorScore', () => {
    it('returns 100 when temperature is ideal (24°C) and no rain', () => {
      const day = makeDay({ maxTemperature: 24, rain: 0 });
      expect(day.getOutdoorScore()).toBe(100);
    });

    it('penalises deviation from ideal temperature', () => {
      const day = makeDay({ maxTemperature: 30, rain: 0 });
      // |30 - 24| * 3 = 18 penalty
      expect(day.getOutdoorScore()).toBe(82);
    });

    it('penalises rain', () => {
      const day = makeDay({ maxTemperature: 24, rain: 5 });
      // 5 * 8 = 40 penalty
      expect(day.getOutdoorScore()).toBe(60);
    });

    it('clamps score to 0 on extreme conditions', () => {
      const day = makeDay({ maxTemperature: 50, rain: 20 });
      expect(day.getOutdoorScore()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getSurfScore', () => {
    it('returns 100 when wind is ideal (22 km/h), no gusts above threshold, no rain', () => {
      const day = makeDay({ windSpeed: 22, windGust: 0, rain: 0 });
      expect(day.getSurfScore()).toBe(100);
    });

    it('penalises wind deviation', () => {
      const day = makeDay({ windSpeed: 10, windGust: 0, rain: 0 });
      // |10 - 22| * 4 = 48 penalty
      expect(day.getSurfScore()).toBe(52);
    });

    it('penalises gusts above 35', () => {
      const day = makeDay({ windSpeed: 22, windGust: 40, rain: 0 });
      // (40 - 35) * 2 = 10 penalty
      expect(day.getSurfScore()).toBe(90);
    });

    it('does not penalise gusts below threshold', () => {
      const day = makeDay({ windSpeed: 22, windGust: 30, rain: 0 });
      expect(day.getSurfScore()).toBe(100);
    });

    it('penalises rain', () => {
      const day = makeDay({ windSpeed: 22, windGust: 0, rain: 4 });
      // 4 * 3 = 12 penalty
      expect(day.getSurfScore()).toBe(88);
    });
  });

  describe('getSkiScore', () => {
    it('gives bonus for snow', () => {
      const day = makeDay({ snow: 3, maxTemperature: 0, rain: 0 });
      // 3 * 18 = 54 snow + (12 - 0) * 4 = 48 cold = 100 (clamped)
      expect(day.getSkiScore()).toBe(100);
    });

    it('gives cold bonus when temperature below 12°C', () => {
      const day = makeDay({ snow: 0, maxTemperature: 4, rain: 0 });
      // (12 - 4) * 4 = 32
      expect(day.getSkiScore()).toBe(32);
    });

    it('does not give cold bonus above 12°C', () => {
      const day = makeDay({ snow: 0, maxTemperature: 20, rain: 0 });
      expect(day.getSkiScore()).toBe(0);
    });

    it('penalises rain', () => {
      const day = makeDay({ snow: 2, maxTemperature: 0, rain: 3 });
      // 2*18 = 36 + (12-0)*4 = 48 - 3*6 = 18 → 66
      expect(day.getSkiScore()).toBe(66);
    });
  });

  describe('getIndoorScore', () => {
    it('returns base score with no weather effects', () => {
      const day = makeDay({ rain: 0, maxTemperature: 20, snow: 0 });
      expect(day.getIndoorScore()).toBe(20);
    });

    it('gives bonus for rain', () => {
      const day = makeDay({ rain: 5, maxTemperature: 20, snow: 0 });
      // 20 + 5*7 = 55
      expect(day.getIndoorScore()).toBe(55);
    });

    it('gives bonus for heat above 28°C', () => {
      const day = makeDay({ rain: 0, maxTemperature: 32, snow: 0 });
      // 20 + (32 - 28) * 4 = 36
      expect(day.getIndoorScore()).toBe(36);
    });

    it('does not give heat bonus below 28°C', () => {
      const day = makeDay({ rain: 0, maxTemperature: 25, snow: 0 });
      expect(day.getIndoorScore()).toBe(20);
    });

    it('gives bonus for snow', () => {
      const day = makeDay({ rain: 0, maxTemperature: 20, snow: 4 });
      // 20 + 4*3 = 32
      expect(day.getIndoorScore()).toBe(32);
    });

    it('clamps score to 100', () => {
      const day = makeDay({ rain: 20, maxTemperature: 50, snow: 10 });
      expect(day.getIndoorScore()).toBe(100);
    });
  });

  describe('isGoodFor* methods (threshold = 60)', () => {
    it('isGoodForOutdoor returns true when outdoor score >= 60', () => {
      const good = makeDay({ maxTemperature: 24, rain: 0 });
      const bad = makeDay({ maxTemperature: 24, rain: 20 });
      expect(good.isGoodForOutdoor()).toBe(true);
      expect(bad.isGoodForOutdoor()).toBe(false);
    });

    it('isGoodForSurf returns true when surf score >= 60', () => {
      const good = makeDay({ windSpeed: 22, windGust: 0, rain: 0 });
      const bad = makeDay({ windSpeed: 0, windGust: 50, rain: 10 });
      expect(good.isGoodForSurf()).toBe(true);
      expect(bad.isGoodForSurf()).toBe(false);
    });

    it('isGoodForSki returns true when ski score >= 60', () => {
      const good = makeDay({ snow: 4, maxTemperature: -5, rain: 0 });
      const bad = makeDay({ snow: 0, maxTemperature: 20, rain: 0 });
      expect(good.isGoodForSki()).toBe(true);
      expect(bad.isGoodForSki()).toBe(false);
    });

    it('isGoodForIndoor returns true when indoor score >= 60', () => {
      const good = makeDay({ rain: 10, maxTemperature: 20, snow: 0 });
      const bad = makeDay({ rain: 0, maxTemperature: 20, snow: 0 });
      expect(good.isGoodForIndoor()).toBe(true);
      expect(bad.isGoodForIndoor()).toBe(false);
    });
  });
});
