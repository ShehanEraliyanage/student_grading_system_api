/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ClassValidationPipe<T> implements PipeTransform<T> {
  async transform(value: T, { metatype }: ArgumentMetadata): Promise<T> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      const failedConstraints = errors[0].constraints;
      if (failedConstraints) {
        const keys = Object.keys(failedConstraints);
        throw new BadRequestException(
          keys.length > 0 ? failedConstraints[keys[0]] : 'Validation failed',
        );
      }
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
