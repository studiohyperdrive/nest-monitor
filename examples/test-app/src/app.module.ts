import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorModule } from '../../../src/monitor.module';
import { InputConfig } from '../../../src/models/input.config.model';
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
          host: 'localhost',
          port: 3000,
        },
      },
    },
  ],
};

@Module({
  imports: [MonitorModule.forConfig(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
