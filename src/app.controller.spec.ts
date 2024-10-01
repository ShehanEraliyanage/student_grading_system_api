import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getAlive', () => {
    it('should return uptime and OK message', async () => {
      const result = await appController.getAlive();
      expect(result).toEqual({
        uptime: expect.any(Number),
        message: 'OK',
        timestamp: expect.any(Number),
      });
    });
  });
});
