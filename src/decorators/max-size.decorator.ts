import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validates an array size ensuring that it is 
 * not more than specified length
 * @param validationOptions Options used to pass to validation decorators.
 */
export function MaxSize(constraint: number, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'MaxSize',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: MaxSizeRule,
        constraints: [constraint]
      });
    };
  }


@ValidatorConstraint({ name: 'MaxSize', async: true })
export class MaxSizeRule implements ValidatorConstraintInterface {

  async validate(data: number[], args: ValidationArguments) {
    const length = data.length;
    if (!length || data.length < args.constraints[0]) return false;

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} size must be atmost ${args.constraints[0]}`;
  }
}
