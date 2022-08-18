import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserInput } from '../dto/create-user.input';
import { User } from '../entity/user.entity';
import { UsersResolver_test } from './users.resolver-test';


const mockUsersResolver: User = {
    id: 1,
    name: "nguyen",
    username: "nguyen2605",
    password: "123",
    isAdmin: true,
};
const usersResolverMock = {
    findOne: jest.fn((id: number): User => mockUsersResolver),
    findAll: jest.fn((): User[] => [mockUsersResolver]),
};

describe('UsersResolver', () => {
    let usersResolver: UsersResolver_test;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersResolver_test,
                { provide: UsersResolver_test, useValue: usersResolverMock },
            ],
        }).compile();

        usersResolver = module.get<UsersResolver_test>(UsersResolver_test);
    });

    it('should be defined', () => {
        expect(usersResolver).toBeDefined();
    });
    it('testing findOne method', () => {
        const result = usersResolver.findOne(1);
        expect(result).toEqual(mockUsersResolver);
    });
    it('testing findAll method', () => {
        const result = usersResolver.findAll();
        expect(Array.isArray(result)).toEqual(true);
    });

});
