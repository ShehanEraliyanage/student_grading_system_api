import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IReqUserInfo } from 'src/auth/interfaces/req-user-Info.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IReqUserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
