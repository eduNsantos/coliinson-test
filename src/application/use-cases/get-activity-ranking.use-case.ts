
import type ActivityContract from "src/domain/activity/contracts/activity.contract";
import GetRankingByCityOrTownOutput from "../dtos/get-ranking-by-city-or-town-output.dto";
import GetActivityRankingMapper from "../mappers/get-activity-ranking.mapper";
import { Inject } from "@nestjs/common";

export default class GetCityActivityRankingUseCase {
  constructor(
    @Inject('ActivityContract')
    private activity: ActivityContract
  ) {}

  async execute(search: string): Promise<GetRankingByCityOrTownOutput> {
    const data = await this.activity.findRankingByCityOrTown(search);

    return GetActivityRankingMapper.toOutput(data);
  }
}
