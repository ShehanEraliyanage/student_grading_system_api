import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IReqUserInfo } from './interfaces/req-user-Info.interface';
import { jwtConfig } from 'src/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
  }): Promise<IReqUserInfo> {
    try {
      const user = await this.usersService.getUserById(payload.sub);

      // const role= await this.usersService.findUserRole()
      return {
        userId: payload.sub,
        email: payload.email,
        firstName: user?.name,
        // contactId: user?.contact._id,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'The email or password you entered is wrong',
      );
    }
  }
}
