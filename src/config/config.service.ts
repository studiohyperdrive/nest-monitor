import { Injectable } from '@nestjs/common';
import { InputConfig } from '../models/input.config.model';

@Injectable()
export class ConfigService {
  public constructor(public config: InputConfig) {}
}
