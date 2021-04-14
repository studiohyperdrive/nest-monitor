import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { ICustomHealth } from '../../../../src/models/custom.health.model';

export interface Dog {
  name: string;
  type: string;
}

@Injectable()
export class DogHealthIndicator
  extends HealthIndicator
  implements ICustomHealth {
  private dogs: Dog[] = [
    { name: 'Fido', type: 'goodboy' },
    { name: 'Rex', type: 'badboy' },
  ];

  isHealthy(): Promise<HealthIndicatorResult> {
    const badboys = this.dogs.filter((dog) => dog.type === 'badboy');
    const isHealthy = badboys.length === 0;
    const result = this.getStatus('doge', isHealthy, {
      badboys: badboys.length,
    });

    if (isHealthy) {
      return Promise.resolve(result);
    }
    throw new HealthCheckError('Dogcheck failed', result);
  }
}
