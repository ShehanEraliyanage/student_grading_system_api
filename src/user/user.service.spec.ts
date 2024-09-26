import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let model: Model<UserDocument>;

  const mockUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  };

  const mockUserModel = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findById: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should create a new user', async () => {
    const user = await service.create(
      'Test User',
      'testuser@example.com',
      'password123',
    );
    expect(user).toEqual(mockUser);
  });

  it('should return all users', async () => {
    const users = await service.findAll();
    expect(users).toEqual([mockUser]);
  });

  it('should return a single user by id', async () => {
    const user = await service.findOne('someId');
    expect(user).toEqual(mockUser);
  });

  it('should delete a user by id', async () => {
    const user = await service.delete('someId');
    expect(user).toEqual(mockUser);
  });
});
