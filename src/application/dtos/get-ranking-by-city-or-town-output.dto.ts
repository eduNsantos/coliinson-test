export default class GetRankingByCityOrTownOutput {
    constructor(
        public city: string,
        public country: string,
        public latitude: number,
        public longitude: number,
        // public ranking: {
        //     surfing: number;
        //     skiing: number;
        //     outdoor: number;
        //     indoor: number;
        // }
    ) {}
}
