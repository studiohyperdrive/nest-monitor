import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ICustomHealth } from './custom.health.model';

export class InputConfig {
  public constructor(
    public version: string,
    public name: string,
    public environment: string,
    public httpChecks?: HttpCheck[],
    public microserviceChecks?: MicroServiceCheck[],
    public memoryCheck?: MemoryCheck,
    public typeOrmCheck?: TypeOrmCheck,
    public customHealthChecks?: ICustomHealth[],
  ) {}
}

export class HttpCheck {
  public constructor(public siteName: string, public siteUrl: string) {}
}

export class MicroServiceCheck {
  public constructor(
    public microserviceName: string,
    public transport: Transport,
    public config: MicroserviceOptions,
  ) {}
}

export class MemoryCheck {
  public constructor(
    public name: string = 'memory',
    public heapThreshold: number,
  ) {}
}

export class TypeOrmCheck {
  public constructor(
    public name: string = 'database',
    public timeout: number,
    public options: TypeOrmModuleOptions,
  ) {}
}
