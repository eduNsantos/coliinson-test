import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SearchByLocationType {
  @Field()
  city!: string;

  @Field()
  country!: string;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;
}
