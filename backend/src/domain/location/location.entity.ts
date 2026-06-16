interface ILocationEntity {
    country: string;
    state: string;
    city: string;
    latitude: number;
    longitude: number;
}

export default class LocationEntity {
    constructor(props: ILocationEntity) {
        Object.assign(this, props);
    }
}
