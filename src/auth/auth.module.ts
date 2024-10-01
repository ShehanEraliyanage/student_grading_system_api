import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';

import { SessionSerializer } from './session.serializer';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import {
  UserSession,
  UserSessionSchema,
} from '../user/schemas/user.session.schema';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserSession.name, schema: UserSessionSchema },
    ]),

    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: jwtConfig.secret,
    }),
    UserModule,
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
