import { Module } from '@nestjs/common';
import ActivityContract from 'src/domain/activity/contracts/activity.contract';
import GetCityActivityRankingUseCase from 'src/application/use-cases/get-activity-ranking.use-case';
import OpenMeteoRepository from 'src/infrastructure/external/weather-api/open-meteo.repository';
import { ActivityResolver } from 'src/presentation/graphql/resolvers/activity.resolver';

@Module({
  providers: [
    {
      provide: 'ActivityContract',
      useClass: OpenMeteoRepository,
    },
    {
      provide: GetCityActivityRankingUseCase,
      useFactory: (activity: ActivityContract) => {
        return new GetCityActivityRankingUseCase(activity);
      },
      inject: ['ActivityContract'],
    },
    ActivityResolver,
  ],
})
export class ActivityModule {}