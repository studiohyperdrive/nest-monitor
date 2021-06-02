import { DynamicModule, Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { InputConfig } from './models/input.config.model';
import { TerminusModule } from '@nestjs/terminus';

import { config as debugConfig } from './config/debug.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';

// voodoo magic, be careful
@Module({
  imports: [TerminusModule],
  // Debug: remove later
  controllers: [MonitorController],
  providers: [MonitorService, ConfigService],
  //
})
export class MonitorModule {
  public static forConfig(config: InputConfig): DynamicModule {
    const configService = new ConfigService(config);
    let typeOrm = null;

    if (configService.config.typeOrmCheck) {
      typeOrm = TypeOrmModule.forRoot(
        configService.config.typeOrmCheck.options,
      );
    }

    return {
      module: MonitorModule,
      imports: typeOrm ? [typeOrm] : [],
      controllers: [MonitorController],
      providers: [
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
      exports: [MonitorService],
      global: true,
    };
  }
}
