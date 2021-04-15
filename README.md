# @studiohyperdrive/nestjs-monitor

## Description

Nestjs-monitor is an extension package that can be used on nestjs projects. It implements
2 monitoring routes that list the server's health and various health checks.

## Installation

```bash
$ npm install @studiohyperdrive/nestjs-monitor
```

```
$ yarn add @studiohyperdrive/nestjs-monitor
```

## Installation process

```ts
import { MonitorModule } from '@studiohyperdrive/nestjs-monitor';

@Module({
  imports: [MonitorModule.forConfig(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```MonitorModule.forConfig(config)``` will return a dynamic module configured according to the provided config file.

## Configuration

The package will provide the user with an InputConfig type, giving the config this type will tell you about the required properties 
of this package.

### Required configuration

```js
export const config: InputConfig = {
  // These 3 properties are required
  environment: '',
  name: '',
  version: '',
  ...
};
```

### HTTP health checks

```js
export const config: InputConfig = {
  ...
  httpChecks: [
      {
        // can be named anything, this name will be shown
        // in the response object of /status/monitor
        siteName: 'google',
        siteUrl: 'https://www.google.com',
      },
      {
        siteName: 'facebook',
        siteUrl: 'https://www.faceboggigiugiok.com',
      },
  ],
};
```

HTTP health checks can be used to test if external api's are alive. If your backend is dependend on a google maps api you can test
whether that api gives a lively response.

In this scenario the google check will return an `up` status and the facebook check return a `down` status.

### Memory check

```js
export const config: InputConfig = {
  ...
  memoryCheck: {
    name: 'memory', // Error display name
    heapThreshold: 150, // In megabytes
  },
```

A memory check will see if the server exceeds a certain threshold defined in the config, if that's the case
it will respond with an `up` or `down` status.

### Microservices checks

```js
export const config: InputConfig = {
  ...
  microserviceChecks: [
      {
        microserviceName: 'ShoppingCart',
        transport: Transport.TCP,
        config: {
          options: {
            host: 'localhost',
            port: 3000,
          },
        },
      },
  ],
}
```

The microservice checks takes in an array of checks and will simply send a ping to all of them to see if they are still alive,
in return they respond with the `up` or `down` status.

### TypeORM checks

```js
export const config: InputConfig = {
  ...
  typeOrmCheck: {
      name: 'postgres',
      timeout: 3000,
      options: {
        type: 'postgres',
        host: 'localhost',
        port: 3060,
        username: 'arnesix',
        password: '',
        database: 'arnesix',
        entities: [],
      },
    },
}
```

TypeOrm checks are used to ping the database and see if they are still alive, the options field is 
of the type `TypeOrmModuleOptions` what you normally use for the TypeOrm package.

### Custom checks

There are times where you have to define custom checks to test specific code. This is where the custom checks come into play.

```js
const config: InputConfig = {
  ...
  customHealthChecks: [new DogHealthIndicator()],
}
```

Every custom health check has to inherit from HealthIndicator and implement the ICustomHealth interface,
this will force the tests to use the isHealthy function.

```ts
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
```

***IMPORTANT*** `this.getStatus` is what the module uses to verify the health. Your return type must be either the result if that `getStatus` function
or a thrown HealthCheckError.

## Reserved routes

This package will reserve 2 routes, this also means that your project should not define the two following routes:

- [GET] /status/ping
- [GET] /status/monitor

### Route: /status/ping

This route is used for a general health check of the server, if successful it will return the config file to the user.

### Route: /status/monitor

The monitor route will return results depending on the config file.

## Stay in touch

- Author                - Arne Six
- Mainting developer    - Arne Six
- Owner                 - [Studio Hyperdrive](https://www.studiohyperdrive.be)

## License

@studiohyperdrive/nestjs-monitor is [GNU licensed](LICENSE).
