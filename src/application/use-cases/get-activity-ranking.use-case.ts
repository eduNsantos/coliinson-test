
import type ActivityContract from "src/domain/activity/contracts/activity.contract";
import { Inject } from "@nestjs/common";
import OpenMeteoMapper from "../../infrastructure/external/weather-api/open-meteo.mapper";

export default class GetCityActivityRankingUseCase {
  constructor(
    @Inject('ActivityContract')
    private activity: ActivityContract
  ) {}

  async execute(search: string): Promise<any> {
    let coordinates = await this.activity.getLocationCoordinates(search);

    const forecast = await this.activity.getForecastByCoordinates(coordinates.latitude, coordinates.longitude);

    return forecast;
  }
}
