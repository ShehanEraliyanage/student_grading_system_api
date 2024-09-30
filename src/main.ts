import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { serverConfig } from './config/server.config';
import { jwtConfig } from './config/jwt.config';
import { SocketIOAdapter } from './common/adapters/socket-io-adapter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(
    session({
      secret: jwtConfig.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new SocketIOAdapter(app));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Student Grading API Documentation')
    .setDescription('The Student Grading API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(serverConfig.port);
  console.log(`server run on port: ${serverConfig.port}`);
}
bootstrap();
