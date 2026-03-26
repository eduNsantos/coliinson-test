import ActivityContract from "src/domain/activity/contracts/activity.contract";

class OpenMeteoRepository implements ActivityContract {
    private readonly apiUrl: string = "https://api.open-meteo.com/v1";

    async findRankingByCityOrTown(search: string): Promise<string> {
        await fetch(`${this.apiUrl}/search/?city=${search}`);


    }
}