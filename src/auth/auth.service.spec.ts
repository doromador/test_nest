import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "../users/entities/user.entity";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue("test-token")
          }
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("signIn", () => {
    it("should return an access token if credentials are valid", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue({
        userId: "1",
        username: "test",
        password: "hashedPassword"
      } as User);
      jest.spyOn(bcrypt, "compare").mockImplementation(async () => true);

      const result = await authService.signIn("test", "password");
      expect(result).toEqual({ access_token: "test-token" });
      expect(usersService.findOne).toHaveBeenCalledWith("test");
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: "1", username: "test" });
    });

    it("should throw UnauthorizedException if credentials are invalid", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue(null);

      await expect(authService.signIn("test", "password")).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOne).toHaveBeenCalledWith("test");
    });

    it("should throw UnauthorizedException if password is incorrect", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue(
        {
          userId: "1",
          username: "test",
          password: "hashedPassword"
        } as User);
      jest.spyOn(bcrypt, "compare").mockImplementation(async () => false);

      await expect(authService.signIn("test", "wrongpassword")).rejects.toThrow(UnauthorizedException);
      expect(usersService.findOne).toHaveBeenCalledWith("test");
    });
  });

  describe("signUp", () => {
    it("should register a new user if username is not taken", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue(null);
      jest.spyOn(usersService, "create").mockResolvedValue(undefined);
      jest.spyOn(bcrypt, "genSalt").mockImplementation(async () => "test-salt");
      jest.spyOn(bcrypt, "hash").mockImplementation(async () => "hashedPassword");

      const result = await authService.signUp("test", "password");
      expect(result).toEqual({ message: "User registered successfully" });
      expect(usersService.findOne).toHaveBeenCalledWith("test");
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("password", "test-salt");
      expect(usersService.create).toHaveBeenCalledWith({ username: "test", password: "hashedPassword" });
    });

    it("should throw ConflictException if username is already taken", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValue({ username: "test" } as User);

      await expect(authService.signUp("test", "password")).rejects.toThrow(ConflictException);
      expect(usersService.findOne).toHaveBeenCalledWith("test");
    });
  });
});
