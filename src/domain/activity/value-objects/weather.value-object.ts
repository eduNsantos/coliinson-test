import WeatherDayValueObject from "./weather-day.value-object";

export default class WeatherValueObject {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly days: WeatherDayValueObject[]
  ) {}

  getBestDaysForSurf(): WeatherDayValueObject[] {
    return this.days.filter(day => day.isGoodForSurf());
  }

  getBestDaysForOutdoor(): WeatherDayValueObject[] {
    return this.days.filter(day => day.isGoodForOutdoor());
  }

  getBestDaysForSki(): WeatherDayValueObject[] {
    return this.days.filter(day => day.isGoodForSki());
  }

  getBestDaysForIndoor(): WeatherDayValueObject[] {
    return this.days.filter(day => day.isGoodForIndoor());
  }

  getSurfScore(): number {
    return this.getBestDaysForSurf().length;
  }

  getOutdoorScore(): number {
    return this.getBestDaysForOutdoor().length;
  }

  getSkiScore(): number {
    return this.getBestDaysForSki().length;
  }

  getIndoorScore(): number {
    return this.getBestDaysForIndoor().length;
  }
}