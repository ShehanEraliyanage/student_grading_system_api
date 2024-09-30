import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { Socket } from 'socket.io';
import { IReqUserInfo } from 'src/auth/interfaces/req-user-Info.interface';
import { jwtConfig } from 'src/config/jwt.config';

export type SocketWithAuth = Socket & IReqUserInfo;

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(
    port: number,
    options: ServerOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) {
    const cors = {
      origin: ['*'],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    // const optionsWithCORS: ServerOptions = {
    //     cors:true,
    //     ...options,
    // };

    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, {
      cors: true,
      ...options,
    });

    server.of('').use(this.createTokenMiddleware(jwtService, this.logger));
    return server;
  }

  createTokenMiddleware =
    (jwtService: JwtService, logger: Logger) =>
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
    async (socket: Socket, next: any) => {
      // for Postman testing support, fallback to token header
      const token =
        socket.handshake.auth.token || socket.handshake.headers['token'];
      logger.debug(`Validating auth token before connection: ${token}`);

      try {
        const payload = jwtService.verify(token, {
          secret: jwtConfig.secret,
        });
        (socket as SocketWithAuth).userId = payload.sub;
        (socket as SocketWithAuth).email = payload.email;

        next();
      } catch (error) {
        logger.error(error);
        next(new Error('FORBIDDEN'));
      }
    };
}
