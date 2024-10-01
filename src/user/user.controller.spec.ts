import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
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
    const user = await controller.create(mockUser);
    expect(user).toEqual(mockUser);
    expect(mockUserService.create).toHaveBeenCalledWith(mockUser);
  });

  it('should return all users', async () => {
    const users = await controller.findAll();
    expect(users).toEqual([mockUser]);
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('should return a single user by id', async () => {
    const user = await controller.findOne('someId');
    expect(user).toEqual(mockUser);
    expect(mockUserService.findOne).toHaveBeenCalledWith('someId');
  });

  it('should delete a user by id', async () => {
    const user = await controller.delete('someId');
    expect(user).toEqual(mockUser);
    expect(mockUserService.delete).toHaveBeenCalledWith('someId');
  });

  it('should throw an error if user not found', async () => {
    mockUserService.findOne.mockRejectedValueOnce(new NotFoundException());

    await expect(controller.findOne('nonExistentId')).rejects.toThrow(
      NotFoundException,
    );
  });
});
