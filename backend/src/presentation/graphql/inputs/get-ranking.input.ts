import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class GetRankingInput {
  @Field()
  @IsString()
  search!: string;
}
