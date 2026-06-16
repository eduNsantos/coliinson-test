import { IsString } from "class-validator";


export default class GetRankingByCityOrTownDto {
  @IsString()
  search: string;

  public constructor(search: string) {
    this.search = search;
  }
}