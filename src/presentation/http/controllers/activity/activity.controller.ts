import { Controller, Get, Inject, Query } from '@nestjs/common';
import GetRankingByCityOrTownOutput from 'src/application/dtos/get-ranking-by-city-or-town-output.dto';
import GetRankingByCityOrTownDto from 'src/application/dtos/get-ranking-by-city-or-town.dto';
import GetCityActivityRankingUseCase from 'src/application/use-cases/get-activity-ranking.use-case';

@Controller('ranking')
export class ActivityController {
    public constructor(
        private useCase: GetCityActivityRankingUseCase
    ) {}

    @Get()
    public async getRanking(@Query() query: GetRankingByCityOrTownDto): Promise<GetRankingByCityOrTownOutput> {
        const result = await this.useCase.execute(query.search);

        return result;
    }
}
