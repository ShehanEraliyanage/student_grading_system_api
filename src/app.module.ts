import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://studentGradingSystem:BTSnA0h76xIFuTE2@studentgradingsystem.6v3e5.mongodb.net/?retryWrites=true&w=majority&appName=StudentGradingSystem',
    ),

    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
