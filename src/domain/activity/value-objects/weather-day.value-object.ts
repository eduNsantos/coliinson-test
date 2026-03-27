export default class WeatherDayValueObject {
  constructor(
    public readonly date: string,
    public readonly minTemperature: number,
    public readonly maxTemperature: number,
    public readonly rain: number,
    public readonly snow: number,
    public readonly windSpeed: number,
    public readonly windGust: number
  ) {}

  isGoodForOutdoor(): boolean {
    return this.rain === 0;
  }

  isGoodForSurf(): boolean {
    return this.windSpeed >= 15;
  }

  isGoodForSki(): boolean {
    return this.snow > 0;
  }

  isGoodForIndoor(): boolean {
    return this.rain > 0;
  }
}