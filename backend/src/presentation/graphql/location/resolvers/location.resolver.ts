import { Args, Query, Resolver } from '@nestjs/graphql';
import FindLocationByNameUseCase from 'src/application/location/use-cases/find-location-by-name.use-case';
import { SearchByLocationType } from '../types/location.type';
import { GetLocationInput } from '../inputs/get-location.input';

@Resolver()
export class LocationResolver {
  constructor(private readonly useCase: FindLocationByNameUseCase) {}

  @Query(() => [SearchByLocationType])
  async location(@Args('input') input: GetLocationInput): Promise<SearchByLocationType[]> {
    return this.useCase.execute(input.locationName);
  }
}
