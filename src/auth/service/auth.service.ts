import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from '../dto/login-user.iput';
import { User } from 'src/users/entity/user.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        const valid = await bcrypt.compare(pass, user?.password);
        if (user && valid) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        return {
            access_token: this.jwtService.sign({ username: user.username, sub: user.id }),
            user,
        };
    }
    async signUp(createUserInput: CreateUserInput) {
        const user = await this.usersService.findOne(createUserInput.username);
        if (user) {
            throw new Error('User already exists');
        }
        const password = await bcrypt.hash(createUserInput.password, 10);
        return this.usersService.create({
            ...createUserInput,
            password,
        });
    }
}