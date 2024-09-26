import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    // Fetch the user by email
    const user = await this.userService.findByEmail(email);

    // If no user found, or password does not match, throw UnauthorizedException
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If validation is successful, return the user
    return user as UserDocument; // Cast to UserDocument to access _id
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Compare plain password with hashed password
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async login(user: UserDocument) {
    const payload = { username: user.email, sub: user._id.toString() }; // Convert ObjectId to string
    // Generate and return a JWT token
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id.toString(), email: user.email, name: user.name },
    };
  }
}
