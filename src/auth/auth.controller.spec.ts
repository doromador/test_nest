import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from "@nestjs/jwt";

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue({ token: 'test-token' }),
            signUp: jest.fn().mockResolvedValue({ message: 'User registered' }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ userId: 'test-user-id' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a JWT token', async () => {
      const result = await authController.signIn({ username: 'test', password: 'test' });
      expect(result).toEqual({ token: 'test-token' });
      expect(authService.signIn).toHaveBeenCalledWith('test', 'test');
    });
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const result = await authController.signUp({ username: 'test', password: 'test' });
      expect(result).toEqual({ message: 'User registered' });
      expect(authService.signUp).toHaveBeenCalledWith('test', 'test');
    });
  });
});
