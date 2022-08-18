import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/module/auth.module';
import { AuthResolver } from './auth/resolver/auth.resolver';
import { User } from './users/entity/user.entity';
import { UsersModule } from './users/module/users.module';
import { AbilityModule } from './ability/ability.module';



@Module({
  imports: [AuthModule, AbilityModule, UsersModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs',
      synchronize: false,
      logging: true,
      entities: [User],
    })],
  controllers: [AppController],
  providers: [AppService, AuthResolver,],
})
export class AppModule {
  
 }