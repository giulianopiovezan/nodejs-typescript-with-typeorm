import { ValueTransformer } from 'typeorm';

export default class NumberTransformer implements ValueTransformer {
  to(value: number): number {
    return value;
  }

  from(value: string): number {
    return Number(value);
  }
}
