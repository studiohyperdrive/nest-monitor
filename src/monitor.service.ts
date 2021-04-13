import { Injectable, Logger } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { MonitorModule } from './monitor.module';

@Injectable()
export class MonitorService {
  // private health: HealthCheckService;
  // private http: HttpHealthIndicator;
  private microservice: MicroserviceHealthIndicator = null;

  public constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private typeOrm: TypeOrmHealthIndicator,
  ) {
    if (this.containsMicroServiceChecks()) {
      this.microservice = new MicroserviceHealthIndicator();
    }
  }

  public containsMicroServiceChecks(): boolean {
    return MonitorModule.config.microserviceChecks != null;
  }

  public containsTypeOrmCheck(): boolean {
    return MonitorModule.config.typeOrmCheck != null;
  }

  // This is the non-syntactic sugar of dependency injection, this way we can
  // check whether some packages/health checks exist before instantiating them and cache
  // the resources in the backend.

  /*
  public constructor() {
    this.health = new HealthCheckService(new HealthCheckExecutor());
    this.http = new HttpHealthIndicator(new HttpService());
  }
   */

  @HealthCheck()
  public HttpHealthCheck() {
    if (MonitorModule.config.httpChecks) {
      return this.health.check(
        MonitorModule.config.httpChecks.map((httpCheck) => () =>
          this.http.pingCheck(httpCheck.siteName, httpCheck.siteUrl),
        ),
      );
    }

    return null;
  }

  @HealthCheck()
  public MicroserviceHealthCheck() {
    if (MonitorModule.config.microserviceChecks) {
      return this.health.check(
        MonitorModule.config.microserviceChecks.map((m) => () =>
          this.microservice.pingCheck(m.microserviceName, {
            transport: m.transport,
          }),
        ),
      );
    }

    return null;
  }

  @HealthCheck()
  public async MemoryHealthCheck() {
    if (MonitorModule.config.memoryCheck) {
      return this.health.check([
        () =>
          this.memory.checkHeap(
            MonitorModule.config.memoryCheck.name,
            MonitorModule.config.memoryCheck.heapThreshold * 1024 * 1024,
          ),
      ]);
    }

    return null;
  }

  @HealthCheck()
  public async TypeOrmCheck() {
    if (MonitorModule.config.typeOrmCheck) {
      return this.health.check([
        () =>
          this.typeOrm.pingCheck(MonitorModule.config.typeOrmCheck.name, {
            timeout: MonitorModule.config.typeOrmCheck.timeout,
          }),
      ]);
    }

    return null;
  }
}
