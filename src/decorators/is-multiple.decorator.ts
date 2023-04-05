import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validates a field ensuring that it is 
 * a multiple of specified
 * @param validationOptions Options used to pass to validation decorators.
 */
export function IsMultiple(constraint: number, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'IsMultiple',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsMultipleRule,
        constraints: [constraint]
      });
    };
  }


@ValidatorConstraint({ name: 'IsMultiple', async: true })
export class IsMultipleRule implements ValidatorConstraintInterface {

  async validate(data: number, args: ValidationArguments) {
    if ((data % args.constraints[0]) !== 0) return false;

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} size must be a multiple of ${args.constraints[0]}`;
  }
}
