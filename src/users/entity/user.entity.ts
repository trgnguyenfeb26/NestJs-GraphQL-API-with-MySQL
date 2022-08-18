import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('user')
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    username: string;

    @Column()
    @Field()
    password: string;

    @Column({ default: false })
    @Field()
    isAdmin: boolean;

}