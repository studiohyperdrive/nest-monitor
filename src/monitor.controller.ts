import { Controller, Get, Logger } from '@nestjs/common';
import { MonitorModule } from './monitor.module';
import { Config } from './models/config.model';
import { MonitorService } from './monitor.service';

@Controller('/status')
export class MonitorController {
  public constructor(private monitorService: MonitorService) {}

  @Get('ping')
  getPing() {
    if (MonitorModule.config == null) {
      Logger.error('Config object appears to be null');
    }

    const config: Config = {
      ...MonitorModule.config,
      success: true,
    };

    return config;
  }

  @Get('monitor')
  async getMonitor(): Promise<any> {
    const httpResult = await this.monitorService.HttpHealthCheck();
    const microservicesResult = await this.monitorService.MicroserviceHealthCheck();
    const memoryResult = await this.monitorService.MemoryHealthCheck();
    const typeOrmResult = await this.monitorService.TypeOrmCheck();

    return {
      http: httpResult ? httpResult : null,
      microservices: microservicesResult ? microservicesResult : null,
      memory: memoryResult ? memoryResult : null,
      typeOrm: typeOrmResult ? typeOrmResult : null,
    };

    // todo: Cycle through dependencies and do a vibe check :D
  }
}
