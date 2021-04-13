import { Controller, Get, Logger } from '@nestjs/common';
import { Config } from './models/config.model';
import { ConfigService } from './config/config.service';
import { MonitorService } from './monitor.service';

@Controller('/status')
export class MonitorController {
  public constructor(
    private configService: ConfigService,
    private monitorService: MonitorService,
  ) {}

  @Get('ping')
  getPing() {
    if (this.configService.config == null) {
      Logger.error('Config object appears to be null');
    }

    const config: Config = {
      ...this.configService.config,
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
