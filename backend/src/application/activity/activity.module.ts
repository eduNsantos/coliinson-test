import { Module } from '@nestjs/common';
import type LocationRepository from 'src/domain/location/location.repository';
import type ForecastContract from 'src/domain/activity/contracts/activity.contract';
import OpenMeteoRepository from 'src/infrastructure/external/weather-api/open-meteo.repository';
import GetCityActivityRankingUseCase from './use-cases/get-activity-ranking.use-case';
import { ActivityResolver } from 'src/presentation/graphql/activity/activity.resolver';

@Module({
  providers: [
    { provide: 'LocationRepository', useClass: OpenMeteoRepository },
    { provide: 'ForecastContract', useClass: OpenMeteoRepository },
    {
      provide: GetCityActivityRankingUseCase,
      useFactory: (location: LocationRepository, forecast: ForecastContract) =>
        new GetCityActivityRankingUseCase(location, forecast),
      inject: ['LocationRepository', 'ForecastContract'],
    },
    ActivityResolver,
  ],
})
export class ActivityModule {}
