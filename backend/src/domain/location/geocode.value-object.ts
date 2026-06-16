export default class GeocodeValueObject {
  constructor(
    public readonly city: string,
    public readonly country: string,
    public readonly latitude: number,
    public readonly longitude: number
  ) {}
}
