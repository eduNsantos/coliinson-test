import { Module } from '@nestjs/common';
import ActivityContract from 'src/domain/activity/contracts/activity.contract';
import GetCityActivityRankingUseCase from 'src/application/use-cases/get-activity-ranking.use-case';
import { ActivityController } from 'src/presentation/http/controllers/activity/activity.controller';
import OpenMeteoRepository from 'src/infrastructure/external/weather-api/open-meteo.repository';

@Module({
  controllers: [ActivityController],
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
  ],
})
export class ActivityModule {}