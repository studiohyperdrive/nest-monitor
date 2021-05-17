import { HealthCheckError, HealthCheckResult } from '@nestjs/terminus';

export class Util {
  public static MapPromise(
    promise: PromiseSettledResult<HealthCheckResult | HealthCheckError>,
  ) {
    let returnObj;

    if (promise.status == 'fulfilled') {
      returnObj = {
        status: (promise.value as HealthCheckResult).status,
        info: (promise.value as HealthCheckResult).info,
      };
    } else {
      returnObj = {
        status: (promise.reason.response as HealthCheckResult).status,
        error: (promise.reason.response as HealthCheckResult).error,
      };
    }

    return returnObj;
  }
}
