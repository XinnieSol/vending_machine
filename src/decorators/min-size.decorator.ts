import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validates an array size ensuring that it is 
 * not less than specified length
 * @param validationOptions Options used to pass to validation decorators.
 */
export function MinSize(constraint: number, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
      registerDecorator({
        name: 'MinSize',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: MinSizeRule,
        constraints: [constraint]
      });
    };
  }


@ValidatorConstraint({ name: 'MinSize', async: true })
export class MinSizeRule implements ValidatorConstraintInterface {

  async validate(data: number[], args: ValidationArguments) {
    const length = data.length;
    if (!length || data.length < args.constraints[0]) return false;

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} size must be atleast ${args.constraints[0]}`;
  }
}
