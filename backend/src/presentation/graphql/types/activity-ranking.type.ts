import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ActivityScoreType {
  @Field()
  activity!: string;

  @Field(() => Float)
  score!: number;
}

@ObjectType()
export class RankingByDayType {
  @Field()
  date!: string;

  @Field(() => [ActivityScoreType])
  ranking!: ActivityScoreType[];
}
