import * as config from 'config';

const jwtConfiguration = config.get<{
  secret: string;
  saltRounds: number;
}>('jwt');

export const jwtConfig: {
  secret: string;
  saltRounds: number;
} = {
  secret: jwtConfiguration.secret,
  saltRounds: jwtConfiguration.saltRounds,
};
