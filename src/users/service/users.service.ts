import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, getConnection, Repository } from 'typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        
    ) { }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const user: User = await this.usersRepository.create(createUserInput);
        return await this.usersRepository.save(user);
    }
    async update(updateUserInput: UpdateUserInput, data: any) {
        await this.usersRepository.update(updateUserInput, data);
        return this.usersRepository.findOneBy(updateUserInput);
    }


    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOneByID(id: number): Promise<User> {
        return this.usersRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.usersRepository.findOneBy({ username });
    }
    async createMultipleUsers(Users: User[]) {
        const connection = getConnection();
        const queryRunner = this.dataSource.createQueryRunner();
     
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(Users[0]);
            await queryRunner.manager.save(Users[1]);
            await queryRunner.commitTransaction();
        }catch (err) {
            await queryRunner.rollbackTransaction();
        }finally {
            await queryRunner.release();
        }
    } 

}