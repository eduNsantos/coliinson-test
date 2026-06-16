import GetCityActivityRankingUseCase from './get-activity-ranking.use-case';
import GeocodeValueObject from 'src/domain/activity/value-objects/geocode.value-object';
import WeatherDayValueObject from 'src/domain/activity/value-objects/weather-day.value-object';
import WeatherValueObject from 'src/domain/activity/value-objects/weather.value-object';
import ActivityContract from 'src/domain/activity/contracts/activity.contract';

const makeDay = (date: string) =>
  new WeatherDayValueObject(date, 15, 24, 0, 0, 22, 0);

const makeCoordinates = () =>
  new GeocodeValueObject('São Paulo', 'Brazil', -23.5505, -46.6333);

const makeForecast = (days: WeatherDayValueObject[]) =>
  new WeatherValueObject(-23.5505, -46.6333, days);

const makeActivityContract = (overrides: Partial<ActivityContract> = {}): ActivityContract => ({
  getLocationCoordinates: jest.fn().mockResolvedValue(makeCoordinates()),
  getForecastByCoordinates: jest.fn().mockResolvedValue(makeForecast([makeDay('2024-01-01')])),
  ...overrides,
});

describe('GetCityActivityRankingUseCase', () => {
  it('returns a ranking for each day in the forecast', async () => {
    const days = ['2024-01-01', '2024-01-02', '2024-01-03'].map(makeDay);
    const contract = makeActivityContract({
      getForecastByCoordinates: jest.fn().mockResolvedValue(makeForecast(days)),
    });

    const useCase = new GetCityActivityRankingUseCase(contract);
    const result = await useCase.execute('São Paulo');

    expect(result).toHaveLength(3);
  });

  it('each day has a date and 4 ranked activities', async () => {
    const contract = makeActivityContract();
    const useCase = new GetCityActivityRankingUseCase(contract);
    const result = await useCase.execute('São Paulo');

    expect(result[0].date).toBe('2024-01-01');
    expect(result[0].ranking).toHaveLength(4);
  });

  it('activities in ranking are sorted by score descending', async () => {
    const contract = makeActivityContract();
    const useCase = new GetCityActivityRankingUseCase(contract);
    const result = await useCase.execute('São Paulo');

    const scores = result[0].ranking.map(r => r.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('calls getLocationCoordinates with the search string', async () => {
    const contract = makeActivityContract();
    const useCase = new GetCityActivityRankingUseCase(contract);
    await useCase.execute('London');

    expect(contract.getLocationCoordinates).toHaveBeenCalledWith('London');
  });

  it('calls getForecastByCoordinates with coordinates from geocode', async () => {
    const coords = makeCoordinates();
    const contract = makeActivityContract({
      getLocationCoordinates: jest.fn().mockResolvedValue(coords),
    });
    const useCase = new GetCityActivityRankingUseCase(contract);
    await useCase.execute('São Paulo');

    expect(contract.getForecastByCoordinates).toHaveBeenCalledWith(coords.latitude, coords.longitude);
  });

  it('wraps errors thrown by the contract in a descriptive message', async () => {
    const contract = makeActivityContract({
      getLocationCoordinates: jest.fn().mockRejectedValue(new Error('Network timeout')),
    });
    const useCase = new GetCityActivityRankingUseCase(contract);

    await expect(useCase.execute('Unknown')).rejects.toThrow(
      'An error occurred while fetching the activity ranking. Network timeout'
    );
  });

  it('each ranking entry has activity name and numeric score', async () => {
    const contract = makeActivityContract();
    const useCase = new GetCityActivityRankingUseCase(contract);
    const result = await useCase.execute('São Paulo');

    for (const entry of result[0].ranking) {
      expect(['surf', 'outdoor', 'ski', 'indoor']).toContain(entry.activity);
      expect(typeof entry.score).toBe('number');
    }
  });
});
