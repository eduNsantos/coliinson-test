import GeocodeValueObject from "../value-objects/geocode.value-object";
import WeatherValueObject from "../value-objects/weather.value-object";

export default interface ActivityContract {
  getLocationCoordinates(city: string): Promise<GeocodeValueObject>;
  getForecastByCoordinates(latitude: number, longitude: number): Promise<WeatherValueObject>;
}
