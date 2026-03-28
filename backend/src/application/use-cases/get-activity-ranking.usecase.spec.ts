describe('GetCityActivityRanking', () => {
  let fakeWeatherService: any;
  beforeAll(() => {
    jest.resetModules();
  });

  it('should rank activities based on weather', async () => {
    const useCase = new GetCityActivityRankingUseCase(fakeWeatherService);

    const result = await useCase.execute({
      city: 'Santo André'
    });

    expect(result).toEqual({
      surfing: expect.any(Number),
      skiing: expect.any(Number),
      outdoor: expect.any(Number),
      indoor: expect.any(Number),
    });
  });
});