import { Controller, Get, Query } from '@nestjs/common';
import GetRankingByCityOrTownDto from 'src/application/dtos/GetRankingByCityOrTown.dto';

@Controller('ranking')
export class RankingController {

    public constructor() {

    }

    @Get('/')

    public async getRankingByCityOrTown(@Query() query: GetRankingByCityOrTownDto): Promise<string> {


        return `Ranking data for ${query.city}, ${query.town}`;
    }
}
