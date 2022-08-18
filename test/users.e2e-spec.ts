import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { User } from 'src/users/entity/user.entity';
import { UsersModule } from '../src/users/module/users.module';
import * as pactum from 'pactum';
import { UsersResolver } from '../src/users/resolver/users.resolver';
import { DataSource } from 'typeorm';

const users: User[] =[
    {
    id: 1,
    name: "nguyen",
    username: "nguyen2605",
    password: "123",
    isAdmin: true,
    },
    {
    id: 2,
    name: "nguyen trung",
    username: "nguyen26",
    password: "123",
    isAdmin: false,
    },
    {
    id: 3,
    name: "trung",
    username: "nguyen   ",
    password: "123",
    isAdmin: false,
    },
] 


describe('UserController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
            providers:[DataSource]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('users', () => {
      it('should get the users array', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send(`{query{
            findAll_test{
              id,
              name,
              username,
              password,
              isAdmin
              
            }}}`)
          .expect(200)
         .expect((res) => {
           expect(res.body.data).toEqual(users);
         });
      ;
      });
      describe('one user', () => {
        it('should get a single user', () => {
          return request(app.getHttpServer())
            .post('/graphql')
            .send({ query: '{findOne_test(id:1){id, name,username, password,isAdmin}}' })
            .expect(200)
            .expect((res) => {
              expect(res.body.data).toEqual({
                name: 'nguyen',
                username: 'nguyen2605',
                password: '123',
                id: '1',
                isAdmin:true
              });
            });
        });
      })
        it('', async () => {
    
      const users = await request(app.getHttpServer()).get('/users').expect(200);
      expect(users.body).toEqual(expect.any(Array));
      expect(users.body.length).toBe(1);
      expect(users.body[0]).toEqual({
        ...users,
        id: expect.any(String),
      });
   })
    
    })
  });