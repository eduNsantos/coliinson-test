import { IsString } from "class-validator";


export default class GetRankingByCityOrTownDto {
  @IsString()
  city: string;

  @IsString()
  town: string;

  public constructor(city: string, town: string) {
    this.city = city;
    this.town = town;
  }
}