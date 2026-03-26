import GetRankingByCityOrTownOutput from "../dtos/get-ranking-by-city-or-town-output.dto";

export default class GetActivityRankingMapper {
    static toOutput(data: any): GetRankingByCityOrTownOutput {
        return new GetRankingByCityOrTownOutput(
            data.name,
            data.country,
            data.latitude,
            data.longitude
        );
    }
}