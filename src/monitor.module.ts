import { DynamicModule, Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { InputConfig } from './models/input.config.model';
import { TerminusModule } from '@nestjs/terminus';

import { config as debugConfig } from './config/debug.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

// voodoo magic, be careful
@Module({
  imports: [TerminusModule],
  // Debug: remove later
  controllers: [MonitorController],
  providers: [MonitorService],
  //
})
export class MonitorModule {
  public static config: InputConfig;

  // Debug: remove later
  public constructor() {
    MonitorModule.config = debugConfig;
  }
  //

  public static forConfig(config: InputConfig): DynamicModule {
    MonitorModule.config = config;

    const typeOrm = TypeOrmModule.forRoot(
      MonitorModule.config.typeOrmCheck.options,
    );

    // const mongodb = MongooseModule.forRoot(MonitorModule.config.mongoCheck.uri);

    return {
      module: MonitorModule,
      imports: [typeOrm],
      controllers: [MonitorController],
      providers: [MonitorService],
      exports: [MonitorService],
      global: true,
    };
  }
}
