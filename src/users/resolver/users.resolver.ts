import { ForbiddenError } from '@casl/ability';
import { ForbiddenException, Req, Request, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AbilityFactory, Action } from '../../ability/ability.factory';
import { CheckAbilities } from '../../ability/ability.decorator';
import { AbilitiesGuard } from '../../ability/ability.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt'
import { UsersService } from '../service/users.service';
@Resolver(() => User)

export class UsersResolver {
    constructor(private readonly usersService: UsersService, private abilityFactory: AbilityFactory) { }

    @Mutation(()=>[User])   
    async createMultipleUsers( @Args('users') users: User[]){
        return this.usersService.createMultipleUsers(users);
    }




    @UseGuards(JwtAuthGuard)
    @Mutation(() => User)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
        @Request() req,
    ): Promise<any> {

        const user = { id: 1, name: 'nguyen', username: 'nguyen', password: '123', isAdmin: false };
        const ability = this.abilityFactory.defineAbility(user);
        try {
            ForbiddenError.from(ability).throwUnlessCan(Action.Create, User);
            const user = await this.usersService.findOne(createUserInput.username);
            if (user) {
                throw new Error('User already exists');
            }
            const password = await bcrypt.hash(createUserInput.password, 10);
            return this.usersService.create({ ...createUserInput, password });
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message)
            }
        }

    }

    @Query(() => [User], { name: 'findAll' })
    @UseGuards(AbilitiesGuard)
    @UseGuards(JwtAuthGuard)
    //  @CheckAbilities(new ReadUserAbility())
    findAll() {
        return this.usersService.findAll();
    }

    @Query(() => User, { name: 'findOne' })
    @UseGuards(JwtAuthGuard)
    @CheckAbilities({ action: Action.Read, subject: User })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.findOneByID(id);
    }

    @Mutation(() => User)
    updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @Args('name') name: string,
        @Args('username') username: string,
        @Args('password') password: string,
        @Args('isAdmin') isAdmin: boolean,) {

        const user = { id: 1, name: 'nguyen', username: 'nguyen', password: '123', isAdmin: false };
        const ability = this.abilityFactory.defineAbility(user);
        try {
            ForbiddenError.from(ability).throwUnlessCan(Action.Update, User);
            const user = { name, username, password, isAdmin };
            return this.usersService.update(updateUserInput, user);
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message)
            }
        }

    }

    @Mutation(() => User)
    @UseGuards(JwtAuthGuard)
    @CheckAbilities({ action: Action.Delete, subject: User })
    removeUser(@Args('id', { type: () => Int }) id: number) {
        const user = { id: 1, name: 'nguyen', username: 'nguyen', password: '123', isAdmin: false };
        const ability = this.abilityFactory.defineAbility(user);
        try {
            ForbiddenError.from(ability).throwUnlessCan(Action.Delete, User);
            return this.usersService.remove(id);
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message)
            }
        }
       
    }

    
}