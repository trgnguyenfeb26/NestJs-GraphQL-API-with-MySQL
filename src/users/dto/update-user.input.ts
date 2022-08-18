import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNumberString } from 'class-validator';

@InputType()
export class UpdateUserInput {
    @Field(() => Int)
    @IsNumberString()
    id: number;
}