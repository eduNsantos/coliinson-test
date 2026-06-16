import { Inject } from "@nestjs/common";
import type ForecastContract from "src/domain/activity/contracts/activity.contract";
import type LocationRepository from "src/domain/location/location.repository";
import { RankingByDayType } from "src/presentation/graphql/activity/types/activity-ranking.type";

export default class GetCityActivityRankingUseCase {
  constructor(
    @Inject('LocationRepository')
    private readonly locationRepository: LocationRepository,
    @Inject('ForecastContract')
    private readonly forecastContract: ForecastContract
  ) {}

  async execute(search: string): Promise<RankingByDayType[]> {
    try {
      const locations = await this.locationRepository.findLocationByName(search);
      const { latitude, longitude } = locations[0];
      const forecast = await this.forecastContract.getForecastByCoordinates(latitude, longitude);

      return forecast.days.map((day) => {
        const activities = [
          { activity: 'surf', score: day.getSurfScore() },
          { activity: 'outdoor', score: day.getOutdoorScore() },
          { activity: 'ski', score: day.getSkiScore() },
          { activity: 'indoor', score: day.getIndoorScore() },
        ];

        return {
          date: day.date,
          ranking: activities.sort((a, b) => b.score - a.score),
        };
      });
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      throw new Error(`An error occurred while fetching the activity ranking: ${details}`);
    }
  }
}
