
import { Location } from "../entities/location.entity";

export default interface ActivityContract {
  findRankingByCityOrTown(search: string): Promise<Location>;
}
