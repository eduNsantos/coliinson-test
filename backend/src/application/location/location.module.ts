import { Module } from '@nestjs/common';
import OpenMeteoRepository from 'src/infrastructure/external/weather-api/open-meteo.repository';
import FindLocationByNameUseCase from './use-cases/find-location-by-name.use-case';
import { LocationResolver } from 'src/presentation/graphql/location/resolvers/location.resolver';

@Module({
  providers: [
    { provide: 'LocationRepository', useClass: OpenMeteoRepository },
    FindLocationByNameUseCase,
    LocationResolver,
  ],
})
export class LocationModule {}
