import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = {
    _id: 'someId',
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserModel = {
    new: jest.fn().mockImplementation((userAddDto) => ({
      save: jest.fn().mockResolvedValue({
        _id: 'someId',
        ...userAddDto,
      }),
    })),
    constructor: jest.fn().mockImplementation(function (this: any, userAddDto) {
      Object.assign(this, userAddDto);
      this.save = jest.fn().mockResolvedValue(this);
    }),
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
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
    model = module.get<Model<User>>(getModelToken(User.name));

    // Reset mock call counts before each test
    jest.clearAllMocks();
  });

  // it('should create a new user with hashed password', async () => {
  //   const bcryptSpy = jest
  //     .spyOn(bcrypt, 'hash')
  //     .mockResolvedValue('hashedPassword123');

  //   const newUser = await service.create({
  //     name: 'Test User',
  //     email: 'testuser@example.com',
  //     password: 'password123',
  //   });

  //   expect(bcryptSpy).toHaveBeenCalledWith('password123', 10);
  //   expect(newUser).toEqual({
  //     _id: 'someId',
  //     name: 'Test User',
  //     email: 'testuser@example.com',
  //     password: 'hashedPassword123',
  //   });
  // });

  it('should return all users', async () => {
    mockUserModel.exec.mockResolvedValue([mockUser]);

    const users = await service.findAll();
    expect(users).toEqual([mockUser]);
  });

  it('should return a single user by id', async () => {
    mockUserModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    const user = await service.findOne('someId');
    expect(user).toEqual(mockUser);
    expect(mockUserModel.findById).toHaveBeenCalledWith('someId');
  });

  it('should throw an error if user not found by id', async () => {
    mockUserModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findOne('invalidId')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a user by id', async () => {
    mockUserModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    const deletedUser = await service.delete('someId');
    expect(deletedUser).toEqual(mockUser);
  });

  it('should throw an error if user to delete is not found', async () => {
    mockUserModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.delete('nonExistentId')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should find a user by email', async () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    const user = await service.findByEmail('testuser@example.com');
    expect(user).toEqual(mockUser);
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: 'testuser@example.com',
    });
  });

  it('should throw an error if user not found by email', async () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(
      service.findByEmail('nonexistent@example.com'),
    ).rejects.toThrow(NotFoundException);
  });
});
