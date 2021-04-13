import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/*
export type InputConfig = {
  version: string;
  name: string;
  environment: string;
  httpChecks?: HttpCheck[];
  microserviceChecks?: MicroServiceCheck[];
};

export type HttpCheck = {
  siteName: string;
  siteUrl: string;
};

export type MicroServiceCheck = {
  transport: string;
  options: {
    host: string;
  };
  port: number;
};
 */

export class InputConfig {
  public constructor(
    public version: string,
    public name: string,
    public environment: string,
    public httpChecks?: HttpCheck[],
    public microserviceChecks?: MicroServiceCheck[],
    public memoryCheck?: MemoryCheck, // public diskCheck?: DiskCheck,
    public typeOrmCheck?: TypeOrmCheck, // public mongoCheck?: MongoCheck,
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

export class MongoCheck {
  public constructor(public uri: string) {}
}
/*
export class DiskCheck {
  public constructor(public name: string = 'disk', public capacity: number) {}
}
 */
