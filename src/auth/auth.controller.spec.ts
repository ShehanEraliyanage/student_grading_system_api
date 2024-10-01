import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
// import { LocalAuthGuard } from './local.auth.guard';
// import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-id',
      email: 'test@example.com',
      name: 'Shehan Liyanage',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService login when login is called', async () => {
    mockAuthService.login.mockReturnValue({
      access_token: 'test-token',
      user: mockRequest.user,
    });

    const result = await controller.login(mockRequest);

    expect(authService.login).toHaveBeenCalledWith(mockRequest.user);
    expect(result).toEqual({
      access_token: 'test-token',
      user: mockRequest.user,
    });
  });
});
