import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserSession } from 'src/user/schemas/user.session.schema';
import { IJWT } from './interfaces/local-login-return.interface';
import { jwtDecode } from 'jwt-decode';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectModel(UserSession.name) private userSessionModel: Model<UserSession>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const headers = request?.headers?.authorization;

    if (headers) {
      const token = headers.split(' ')[1];
      const decodedToken: IJWT = jwtDecode(token) as IJWT;
      const sessionId = decodedToken?.sessionId;
      const validity = await this.userSessionModel.findOne({ _id: sessionId });
      if (!validity) {
        return false;
      }
      return true;
    }
    return false;
  }
}
