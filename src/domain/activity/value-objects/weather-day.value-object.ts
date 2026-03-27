export type ActivityScore = number;

export default class WeatherDayValueObject {
  private static readonly SCORE_MIN = 0;
  private static readonly SCORE_MAX = 100;
  private static readonly SCORE_BASE = 100;
  private static readonly GOOD_ACTIVITY_THRESHOLD = 60;

  // Outdoor
  private static readonly OUTDOOR_IDEAL_TEMPERATURE = 24;
  private static readonly OUTDOOR_TEMPERATURE_PENALTY = 3;
  private static readonly OUTDOOR_RAIN_PENALTY = 8;

  // Surf
  private static readonly SURF_IDEAL_WIND_SPEED = 22;
  private static readonly SURF_WIND_PENALTY = 4;
  private static readonly SURF_GUST_THRESHOLD = 35;
  private static readonly SURF_GUST_PENALTY = 2;
  private static readonly SURF_RAIN_PENALTY = 3;

  // Ski
  private static readonly SKI_SNOW_MULTIPLIER = 18;
  private static readonly SKI_COLD_THRESHOLD = 12;
  private static readonly SKI_COLD_BONUS = 4;
  private static readonly SKI_RAIN_PENALTY = 6;

  // Indoor
  private static readonly INDOOR_BASE_SCORE = 20;
  private static readonly INDOOR_RAIN_BONUS = 7;
  private static readonly INDOOR_HEAT_THRESHOLD = 28;
  private static readonly INDOOR_HEAT_BONUS = 4;
  private static readonly INDOOR_SNOW_BONUS = 3;

  constructor(
    public readonly date: string,
    public readonly minTemperature: number,
    public readonly maxTemperature: number,
    public readonly rain: number,
    public readonly snow: number,
    public readonly windSpeed: number,
    public readonly windGust: number
  ) {}

  private clampScore(score: number): ActivityScore {
    return Math.max(WeatherDayValueObject.SCORE_MIN, Math.min(WeatherDayValueObject.SCORE_MAX, Math.round(score)));
  }

  getOutdoorScore(): ActivityScore {
    const temperaturePenalty = Math.abs(this.maxTemperature - WeatherDayValueObject.OUTDOOR_IDEAL_TEMPERATURE) * WeatherDayValueObject.OUTDOOR_TEMPERATURE_PENALTY;
    const rainPenalty = this.rain * WeatherDayValueObject.OUTDOOR_RAIN_PENALTY;

    return this.clampScore(WeatherDayValueObject.SCORE_BASE - temperaturePenalty - rainPenalty);
  }

  getSurfScore(): ActivityScore {
    const windPenalty = Math.abs(this.windSpeed - WeatherDayValueObject.SURF_IDEAL_WIND_SPEED) * WeatherDayValueObject.SURF_WIND_PENALTY;
    const gustPenalty = Math.max(0, this.windGust - WeatherDayValueObject.SURF_GUST_THRESHOLD) * WeatherDayValueObject.SURF_GUST_PENALTY;
    const rainPenalty = this.rain * WeatherDayValueObject.SURF_RAIN_PENALTY;

    return this.clampScore(WeatherDayValueObject.SCORE_BASE - windPenalty - gustPenalty - rainPenalty);
  }

  getSkiScore(): ActivityScore {
    const snowScore = this.snow * WeatherDayValueObject.SKI_SNOW_MULTIPLIER;
    const coldBonus = Math.max(0, WeatherDayValueObject.SKI_COLD_THRESHOLD - this.maxTemperature) * WeatherDayValueObject.SKI_COLD_BONUS;
    const rainPenalty = this.rain * WeatherDayValueObject.SKI_RAIN_PENALTY;

    return this.clampScore(snowScore + coldBonus - rainPenalty);
  }

  getIndoorScore(): ActivityScore {
    const rainBonus = this.rain * WeatherDayValueObject.INDOOR_RAIN_BONUS;
    const heatBonus = Math.max(0, this.maxTemperature - WeatherDayValueObject.INDOOR_HEAT_THRESHOLD) * WeatherDayValueObject.INDOOR_HEAT_BONUS;
    const snowBonus = this.snow * WeatherDayValueObject.INDOOR_SNOW_BONUS;

    return this.clampScore(WeatherDayValueObject.INDOOR_BASE_SCORE + rainBonus + heatBonus + snowBonus);
  }

  isGoodForOutdoor(): boolean {
    return this.getOutdoorScore() >= WeatherDayValueObject.GOOD_ACTIVITY_THRESHOLD;
  }

  isGoodForSurf(): boolean {
    return this.getSurfScore() >= WeatherDayValueObject.GOOD_ACTIVITY_THRESHOLD;
  }

  isGoodForSki(): boolean {
    return this.getSkiScore() >= WeatherDayValueObject.GOOD_ACTIVITY_THRESHOLD;
  }

  isGoodForIndoor(): boolean {
    return this.getIndoorScore() >= WeatherDayValueObject.GOOD_ACTIVITY_THRESHOLD;
  }
}