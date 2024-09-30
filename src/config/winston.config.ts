import {
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as config from 'config';

const logConfig = config.get<{
  logToFile: boolean;
  logFile: string;
  logDirectory: string;
}>('logger');

const transports = logConfig.logToFile
  ? [
      new winston.transports.File({
        filename: logConfig.logFile,
        dirname: logConfig.logDirectory,
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
          winston.format.uncolorize(),
        ),
      }),
    ]
  : [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
    ];

export const winstonConfig: WinstonModuleOptions = {
  level:
    process.env.NODE_ENV === 'release' || process.env.NODE_ENV === 'master'
      ? 'info'
      : 'debug',
  transports,
};
