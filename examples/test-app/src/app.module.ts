import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorModule } from '../../../src/monitor.module';
import { config } from './input.config';

@Module({
  imports: [MonitorModule.forConfig(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
