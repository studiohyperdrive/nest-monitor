import { InputConfig } from '../models/input.config.model';
import { Transport } from '@nestjs/microservices';

export const config: InputConfig = {
  environment: '',
  name: '',
  version: '',
  memoryCheck: {
    name: 'memory',
    heapThreshold: 150,
  },
  httpChecks: [
    {
      siteName: 'google',
      siteUrl: 'https://www.google.com',
    },
    {
      siteName: 'facebook',
      siteUrl: 'https://www.facebook.com',
    },
  ],
  typeOrmCheck: {
    name: 'postgres',
    timeout: 3000,
    options: {
      type: 'postgres',
      host: 'localhost',
      port: 3060,
      username: 'arnesix',
      password: '',
      database: 'arnesix',
      entities: [],
    },
  },
  microserviceChecks: [
    {
      microserviceName: 'ShoppingCart',
      transport: Transport.TCP,
      config: {
        options: {
          host: '',
          port: 9000,
        },
      },
      port: 3000,
    },
  ],
};
