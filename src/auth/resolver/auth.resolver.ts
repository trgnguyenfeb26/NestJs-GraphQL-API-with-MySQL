import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../../users/dto/create-user.input';
import { User } from '../../users/entity/user.entity';
import { LoginResponse } from '../dto/login-response';
import { LoginUserInput } from '../dto/login-user.iput';
import { GqlAuthGuard } from '../gql-auth.guard';
import { AuthService } from '../service/auth.service';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => LoginResponse)
    @UseGuards(GqlAuthGuard)
    login(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context) {
        return this.authService.login(context.user)
    }
    @Mutation(() => User)
    signUp(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.authService.signUp(createUserInput);
    }
}
