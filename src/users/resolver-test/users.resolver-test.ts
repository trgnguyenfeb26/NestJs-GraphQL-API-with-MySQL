import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateUserInput } from "../dto/create-user.input";
import { User } from "../entity/user.entity";
import { UsersService } from "../service/users.service";
import * as bcrypt from 'bcrypt'
import { UpdateUserInput } from "../dto/update-user.input";

@Resolver(() => User)
export class UsersResolver_test {
    constructor(private readonly usersService: UsersService,) { }
    @Mutation(() => User)
    async createUser_test(
        @Args('createUserInput_test') createUserInput: CreateUserInput,
    ) {
        try {
            const password = await bcrypt.hash(createUserInput.password, 10);
            return this.usersService.create({ ...createUserInput, password });
        } catch (error) {
                throw new error
        }
    }

    @Query(() => [User], { name: 'findAll_test' })
    findAll() {
        return this.usersService.findAll();
    }

    @Query(() => User, { name: 'findOne_test' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.findOneByID(id);
    }

    @Mutation(() => User)
    updateUser_test(
        @Args('updateUserInput_test') updateUserInput: UpdateUserInput,
        @Args('name') name: string,
        @Args('username') username: string,
        @Args('password') password: string,
        @Args('isAdmin') isAdmin: boolean,) {

        try {
            const user = { name, username, password, isAdmin };
            console.log(user);
            return this.usersService.update(updateUserInput, user);
        } catch (error) {
                throw new error
        }
    }

    @Mutation(() => User)
    removeUser_test(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.remove(id);
    }
}