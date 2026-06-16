import { Inject } from "@nestjs/common";
import type LocationRepository from "src/domain/location/location.repository";
import GeocodeValueObject from "src/domain/location/geocode.value-object";

export default class FindLocationByNameUseCase {
  constructor(
    @Inject('LocationRepository')
    private readonly locationRepository: LocationRepository
  ) {}

  async execute(search: string): Promise<GeocodeValueObject[]> {
    try {
      return await this.locationRepository.findLocationByName(search);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      throw new Error(`An error occurred while fetching the locations: ${details}`);
    }
  }
}
