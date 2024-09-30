import * as config from 'config';

const serverConfiguration = config.get<{
  port: number;
  hostedDomain: string;
  saltSecret: string;
  env: string;
}>('server');

export const serverConfig: {
  port: number | string;
  hostedDomain: string;
  saltSecret: string;
  env: string;
} = {
  port: process.env.PORT || serverConfiguration.port,
  hostedDomain: process.env.HOSTED_DOMAIN || serverConfiguration.hostedDomain,
  saltSecret: process.env.SALT_SECRET || serverConfiguration.saltSecret,
  env: process.env.NODE_ENV || serverConfiguration.env,
};
