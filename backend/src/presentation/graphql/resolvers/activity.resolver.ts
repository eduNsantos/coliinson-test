import { Args, Query, Resolver } from '@nestjs/graphql';
import GetCityActivityRankingUseCase from 'src/application/use-cases/get-activity-ranking.use-case';
import { GetRankingInput } from 'src/presentation/graphql/inputs/get-ranking.input';
import { RankingByDayType } from 'src/presentation/graphql/types/activity-ranking.type';

@Resolver()
export class ActivityResolver {
  constructor(private readonly useCase: GetCityActivityRankingUseCase) {}

  @Query(() => [RankingByDayType])
  async ranking(@Args('input') input: GetRankingInput): Promise<RankingByDayType[]> {
    return this.useCase.execute(input.search);
  }
}
