import { Controller, Get, Inject, Query } from '@nestjs/common';
import GetRankingByCityOrTownDto from 'src/application/activity/dtos/get-ranking-by-city-or-town.dto';
import GetCityActivityRankingUseCase from 'src/application/activity/use-cases/get-activity-ranking.use-case';

@Controller('ranking')
export class ActivityController {
    public constructor(
        private useCase: GetCityActivityRankingUseCase
    ) {}

    @Get()
    public async getRanking(@Query() query: GetRankingByCityOrTownDto): Promise<any> {
        const result = await this.useCase.execute(query.search);

        return result;
    }
}
