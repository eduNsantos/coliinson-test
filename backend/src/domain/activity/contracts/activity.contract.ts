import WeatherValueObject from "../value-objects/weather.value-object";

export default interface ForecastContract {
  getForecastByCoordinates(latitude: number, longitude: number): Promise<WeatherValueObject>;
}
