import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validates an array size ensuring that it is 
 * equal to length specified
 * @param validationOptions Options used to pass to validation decorators.
 */
export function Size(constraint: number, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'Size',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: SizeRule,
        constraints: [constraint]
      });
    };
  }


@ValidatorConstraint({ name: 'Size', async: true })
export class SizeRule implements ValidatorConstraintInterface {

  async validate(data: number[], args: ValidationArguments) {
    const length = data.length;
    if (!length || data.length !== args.constraints[0]) return false;

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} size must be ${args.constraints[0]}`;
  }
}
