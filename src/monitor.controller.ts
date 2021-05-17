import { Controller, Get, Logger } from '@nestjs/common';
import { Config } from './models/config.model';
import { ConfigService } from './config/config.service';
import { MonitorService } from './monitor.service';
import { Util } from './helpers/promise-map';

@Controller('/status')
export class MonitorController {
  private readonly logger = new Logger(MonitorController.name);

  public constructor(
    private configService: ConfigService,
    private monitorService: MonitorService,
  ) {}

  @Get('ping')
  getPing() {
    if (this.configService.config == null) {
      this.logger.error('Config object appears to be null');

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
        http: Util.MapPromise(httpResult),
        microservices: Util.MapPromise(microservicesResult),
        memory: Util.MapPromise(memoryResult),
        typeOrm: Util.MapPromise(typeOrmResult),
        custom: Util.MapPromise(customHealthResult),
      };
    } catch (e) {
      return e;
    }
  }
}
