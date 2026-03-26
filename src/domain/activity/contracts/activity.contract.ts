
import { OpenMeteoForecastResponse } from "src/infrastructure/external/weather-api/open-meteo.types";

export default interface ActivityContract {
  findRankingByCityOrTown(search: string): Promise<OpenMeteoForecastResponse>;
}
