
import type ActivityContract from "src/domain/activity/contracts/activity.contract";
import { Inject } from "@nestjs/common";

export default class GetCityActivityRankingUseCase {
  constructor(
    @Inject('ActivityContract')
    private activity: ActivityContract
  ) {}

  async execute(search: string): Promise<any> {
    try {

      const coordinates = await this.activity.getLocationCoordinates(search);

      const forecast = await this.activity.getForecastByCoordinates(coordinates.latitude, coordinates.longitude);

      const ranking = forecast.days.map((day) => {

        let actitivies = [
          { activity: 'surf', score: day.getSurfScore() },
          { activity: 'outdoor', score: day.getOutdoorScore() },
          { activity: 'ski', score: day.getSkiScore() },
          { activity: 'indoor', score: day.getIndoorScore() },
        ];

        return {
          date: day.date,
          ranking: actitivies.sort((a, b) => b.score - a.score).slice(0, 4)
        }
      });

      return ranking;
    } catch (error) {
      return {
        error: 'An error occurred while fetching the activity ranking.',
        details: error instanceof Error ? error.message : String(error)
      }
      throw error;
    }
  }
}
