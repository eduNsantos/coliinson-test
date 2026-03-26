
export default interface ActivityContract {
  findRankingByCityOrTown(search: string): Promise<string>;
}
