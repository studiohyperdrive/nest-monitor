import { HealthIndicatorResult } from '@nestjs/terminus';

export interface ICustomHealth {
  isHealthy(): Promise<HealthIndicatorResult>;
}
