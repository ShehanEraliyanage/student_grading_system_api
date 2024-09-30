import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { StatusMonitorModule } from 'nestjs-status-monitor';

import { AppExceptionFilter } from './common/exception-filters/app-exception.filter';
import { AppLoggingInterceptor } from './common/interceptors/app-logging.interceptor';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { serverConfig } from './config/server.config';
import { winstonConfig } from './config/winston.config';

const DB_URL =
  'mongodb+srv://studentGradingSystem:BTSnA0h76xIFuTE2@studentgradingsystem.6v3e5.mongodb.net/?retryWrites=true&w=majority&appName=StudentGradingSystem';

@Module({
  imports: [
    StatusMonitorModule.forRoot({
      title: 'Metjip Nest.js API Monitoring Page',
      path: '/status',
      socketPath: '/socket.io',
      port: Number(serverConfig.port),
      spans: [
        {
          interval: 1, // Every second
          retention: 60, // Keep 60 data points in memory
        },
        {
          interval: 5, // Every 5 seconds
          retention: 60,
        },
        {
          interval: 15, // Every 15 seconds
          retention: 60,
        },
      ],
      chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        responseTime: true,
        rps: true,
        statusCodes: true,
      },

      ignoreStartsWith: ['/admin'],
      healthChecks: [],
    }),
    MongooseModule.forRoot(DB_URL),
    EventEmitterModule.forRoot(),
    // WinstonModule.forRoot(winstonConfig),
    ScheduleModule.forRoot(),
    WinstonModule.forRoot(winstonConfig),
    UserModule,
    AuthModule,

    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGO_URI'),
    //   }),
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AppLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
