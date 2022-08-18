import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../service/users.service';
import { UsersResolver } from '../resolver/users.resolver';
import { UsersController } from '../controller/users.controller';
import { User } from '../entity/user.entity';
import { AbilityModule } from '../../ability/ability.module';
import { UsersResolver_test } from '../resolver-test/users.resolver-test';
import { DataSource } from 'typeorm';



@Module({
  imports: [AbilityModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersResolver,UsersResolver_test],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { private dataSource: DataSource}