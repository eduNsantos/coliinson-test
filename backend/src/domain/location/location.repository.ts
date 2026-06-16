import GeocodeValueObject from "./geocode.value-object";

export default interface LocationRepository {
  findLocationByName(name: string): Promise<GeocodeValueObject[]>;
}
