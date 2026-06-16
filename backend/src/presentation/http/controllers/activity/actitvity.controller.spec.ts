import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import GetCityActivityRankingUseCase from 'src/application/activity/use-cases/get-activity-ranking.use-case';

describe('ActivityController', () => {
  let controller: ActivityController;

  const mockUseCase = {
    execute: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        { provide: GetCityActivityRankingUseCase, useValue: mockUseCase },
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calls useCase.execute with the search query', async () => {
    await controller.getRanking({ search: 'London' } as any);
    expect(mockUseCase.execute).toHaveBeenCalledWith('London');
  });

  it('returns the result from the use case', async () => {
    const mockResult = [{ date: '2024-01-01', ranking: [] }];
    mockUseCase.execute.mockResolvedValueOnce(mockResult);

    const result = await controller.getRanking({ search: 'Paris' } as any);
    expect(result).toEqual(mockResult);
  });
});
