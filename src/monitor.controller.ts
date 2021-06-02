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

      return { success: false, message: 'Config object appears to be null' };
    }

    const config: Config = {
      environment: this.configService.config.environment,
      name: this.configService.config.name,
      version: this.configService.config.version,
      success: true,
    };

    return config;
  }

  @Get('monitor')
  async getMonitor(): Promise<any> {
    // Error can only be caught here, even though the error orginally appears in the check itself.
    try {
      const [
        httpResult,
        microservicesResult,
        memoryResult,
        typeOrmResult,
        customHealthResult,
      ] = await Promise.allSettled([
        this.monitorService.HttpHealthCheck(),
        this.monitorService.MicroserviceHealthCheck(),
        this.monitorService.MemoryHealthCheck(),
        this.monitorService.TypeOrmCheck(),
        this.monitorService.CustomHealthChecks(),
      ]);

      return {
        http: httpResult ? httpResult : null,
        microservices: microservicesResult ? microservicesResult : null,
        memory: memoryResult ? memoryResult : null,
        typeOrm: typeOrmResult ? typeOrmResult : null,
        custom: customHealthResult ? customHealthResult : null,
      };
    } catch (e) {
      return e;
    }

    // todo: Cycle through dependencies and do a vibe check :D
  }
}
