import { InputConfig } from '../../../src/models/input.config.model';
import { Transport } from '@nestjs/microservices';
import { DogHealthIndicator } from './health/dog.health';

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
      siteUrl: 'https://www.faceboggigiugiok.com',
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
  customHealthChecks: [new DogHealthIndicator()],
  microserviceChecks: [
    {
      microserviceName: 'ShoppingCart',
      transport: Transport.TCP,
      config: {
        options: {
          host: 'localhost',
          port: 3000,
        },
      },
    },
  ],
};
