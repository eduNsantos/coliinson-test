export default class GeocodeValueObject {
    constructor(
        public city: string,
        public country: string,
        public latitude: number,
        public longitude: number
    ) {}
}