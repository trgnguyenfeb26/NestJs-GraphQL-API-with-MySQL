import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsNotEmpty()
    password: string;
}