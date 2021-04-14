import { Injectable, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  DiskHealthIndicator,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from './config/config.service';

@Injectable()
export class MonitorService {
  public constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private typeOrm: TypeOrmHealthIndicator,
    private microService: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  public containsMicroServiceChecks(): boolean {
    return this.configService.config.microserviceChecks != null;
  }

  public containsTypeOrmCheck(): boolean {
    return this.configService.config.typeOrmCheck != null;
  }

  public async HttpHealthCheck() {
    if (!this.configService.config.httpChecks) return null;

    return this.health.check(
      this.configService.config.httpChecks.map((httpCheck) => () =>
        this.http.pingCheck(httpCheck.siteName, httpCheck.siteUrl),
      ),
    );
  }

  public MicroserviceHealthCheck() {
    if (!this.configService.config.microserviceChecks) return null;

    return this.health.check(
      this.configService.config.microserviceChecks.map((micro) => () =>
        this.microService.pingCheck(micro.microserviceName, {
          transport: micro.transport,
          options: micro.config,
        }),
      ),
    );
  }

  public async MemoryHealthCheck() {
    if (!this.configService.config.memoryCheck) return null;

    return this.health.check([
      () =>
        this.memory.checkHeap(
          this.configService.config.memoryCheck.name,
          this.configService.config.memoryCheck.heapThreshold * 1024 * 1024,
        ),
    ]);
  }

  public async TypeOrmCheck() {
    if (!this.configService.config.typeOrmCheck) return null;

    return this.health.check([
      () =>
        this.typeOrm.pingCheck(this.configService.config.typeOrmCheck.name, {
          timeout: this.configService.config.typeOrmCheck.timeout,
        }),
    ]);
  }

  public async CustomHealthChecks() {
    if (!this.configService.config.customHealthChecks) return null;

    return this.health.check(
      this.configService.config.customHealthChecks.map((custom) => () =>
        custom.isHealthy(),
      ),
    );
  }
}
