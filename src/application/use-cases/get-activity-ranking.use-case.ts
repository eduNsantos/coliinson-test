class GetCityActivityRankingUseCase {
  constructor(private rankingService: RankingInterface) {}

  async execute(city: string, town: string): Promise<string> {
    return this.rankingService.findRankingByCityOrTown(city, town);
  }
}