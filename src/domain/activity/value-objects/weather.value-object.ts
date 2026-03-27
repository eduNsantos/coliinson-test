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

  private getAverageScore(scores: number[]): number {
    if (scores.length === 0) {
      return 0;
    }

    const total = scores.reduce((sum, score) => sum + score, 0);

    return Math.round(total / scores.length);
  }

  getSurfScore(): number {
    return this.getAverageScore(this.days.map(day => day.getSurfScore()));
  }

  getOutdoorScore(): number {
    return this.getAverageScore(this.days.map(day => day.getOutdoorScore()));
  }

  getSkiScore(): number {
    return this.getAverageScore(this.days.map(day => day.getSkiScore()));
  }

  getIndoorScore(): number {
    return this.getAverageScore(this.days.map(day => day.getIndoorScore()));
  }

  getAverageMaxTemp(): number {
    return this.days.reduce((sum, d) => sum + d.maxTemperature, 0) / this.days.length;
  }
}