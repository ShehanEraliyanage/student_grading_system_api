import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UserSession } from '../user/schemas/user.session.schema';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userSessionModel;

  const mockUser = {
    _id: 'user-id',
    name: 'John Doe',
    email: 'test@example.com',
    password: 'hashed-password',
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
    remove: jest.fn(),
    $isDefault: jest.fn(),
    $isDeleted: jest.fn(),
  };

  // Mock UserSessionModel and ensure _id is available
  const mockUserSessionModel = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({
      _id: 'session-id',
      userId: 'user-id',
      createdAt: new Date(),
    }),
  }));

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(UserSession.name),
          useValue: mockUserSessionModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userSessionModel = module.get(getModelToken(UserSession.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    mockUserService.findByEmail.mockReturnValue(null);

    await expect(
      service.validateUser('test@example.com', 'password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when passwords do not match', async () => {
    mockUserService.findByEmail.mockReturnValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(
      service.validateUser('test@example.com', 'wrong-password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return user when credentials are valid', async () => {
    mockUserService.findByEmail.mockReturnValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.validateUser('test@example.com', 'password');

    expect(result).toEqual(mockUser);
  });

  it('should call jwtService.sign and return a token and user', async () => {
    mockJwtService.sign.mockReturnValue('test-token');

    const result = await service.login(mockUser as any);

    expect(jwtService.sign).toHaveBeenCalledWith({
      email: mockUser.email,
      sub: mockUser._id.toString(),
    });

    expect(result).toEqual({
      access_token: 'test-token',
      user: { id: 'user-id', email: 'test@example.com', name: 'John Doe' },
    });
  });
});
