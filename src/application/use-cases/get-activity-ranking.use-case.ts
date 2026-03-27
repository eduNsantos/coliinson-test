
import type ActivityContract from "src/domain/activity/contracts/activity.contract";
import { Inject } from "@nestjs/common";

export default class GetCityActivityRankingUseCase {
  constructor(
    @Inject('ActivityContract')
    private activity: ActivityContract
  ) {}

  async execute(search: string): Promise<any> {
    const coordinates = await this.activity.getLocationCoordinates(search);

    const forecast = await this.activity.getForecastByCoordinates(coordinates.latitude, coordinates.longitude);

    const ranking = forecast.days.map((day) => ({
      date: day.date,
      surf: day.getSurfScore(),
      outdoor: day.getOutdoorScore(),
      ski: day.getSkiScore(),
      indoor: day.getIndoorScore(),
    }));

    ranking.sort(
      (a, b) =>
        (b.surf + b.outdoor + b.ski + b.indoor) -
        (a.surf + a.outdoor + a.ski + a.indoor),
    );

    return ranking;
  }
}
