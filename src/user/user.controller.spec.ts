import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UserService;

  const mockUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  };

  const mockUserService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should create a new user', async () => {
    const user = await controller.create(
      'Test User',
      'testuser@example.com',
      'password123',
    );
    expect(user).toEqual(mockUser);
  });

  it('should return all users', async () => {
    const users = await controller.findAll();
    expect(users).toEqual([mockUser]);
  });

  it('should return a single user by id', async () => {
    const user = await controller.findOne('someId');
    expect(user).toEqual(mockUser);
  });

  it('should delete a user by id', async () => {
    const user = await controller.delete('someId');
    expect(user).toEqual(mockUser);
  });
});
